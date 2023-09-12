import { Request, Response } from "express";
import * as yup from "yup";
import ElectionContract, { web3 } from "../../web3";
import fs from "fs";
import path from "path";

const schema = yup.object({
  body: yup.object({
    name: yup.string().min(3).required(),
    description: yup.string().min(10).required(),
    candidates: yup.array(
      yup.object({
        name: yup.string().min(3),
        info: yup.string().min(10),
        pic: yup.string().required(),
      })
    ),
  }),
});

const UPLOAD_DIRECTORY = path.join(__dirname, "../../../images");

export default async (req: Request, res: Response) => {
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }

  const instance = await ElectionContract.deployed();
  const status = await instance.getStatus();
  if (status !== "not-started")
    return res.status(400).send("election already started or not reset");

  const accounts = await web3.eth.getAccounts();
  await instance.setElectionDetails(req.body.name, req.body.description, {
    from: accounts[0],
  });

  // Process each candidate to upload their picture and add them to the contract
  const candidates = req.body.candidates;
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    let pic = candidate.pic;
    const filename = Date.now() + "-" + candidate.name + ".jpg";

    pic = pic.split(",")[1];
    // Decode the base64 string to binary
    const imageBuffer = Buffer.from(pic, "base64");

    // Write the binary to a file
    try {
      fs.writeFileSync(path.join(UPLOAD_DIRECTORY, filename), imageBuffer);
      await instance.addCandidate(
        candidate.name,
        candidate.info,
        `/${filename}`,
        { from: accounts[0] }
      );
    } catch (err) {
      console.error(err);
      return res.status(500).send("error saving photo");
    }
  }

  return res.send(req.body);
};

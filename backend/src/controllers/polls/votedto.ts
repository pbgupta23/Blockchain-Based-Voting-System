import { Request, Response } from "express";
import ElectionContract from "../../web3";

export default async (req: Request, res: Response) => {
  const instance = await ElectionContract.deployed();

  
  const votes = await instance.getVotes();

  const response: any = {votedTo : "", voted:false };

  

  for (let i = 0; i < votes.length; i++) {
    const vote = votes[i];

    if (vote[1] === req.body.id){
        response.votedTo =  vote[3];
        response.voted=true ;
    
    }
 
  }

  return res.send({ votes: response });
};

//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract Election {
    mapping(address => bool) admins;
    string name; // name of the election. example: for president
    string description; // description of the election
    bool started;
    bool ended;

    constructor() {
        admins[msg.sender] = true;
        started = false;
        ended = false;
    }

    modifier onlyAdmin() {
        //require(admins[msg.sender] == true, "Only Admin");
        _;
    }

    function addAdmin(address _address) public onlyAdmin {
        admins[_address] = true;
    }

    /*****************************CANDIDATES SECTION*****************************/

    struct Candidate {
        string name;
        string info;
        string pic; // new field to store candidate's image
        bool exists;
    }
    Candidate[] public candidateNames;

    function addCandidate(string memory _candidateName, string memory _info, string memory _pic)
        public
        onlyAdmin
    {
        Candidate memory newCandidate = Candidate({
            name: _candidateName,
            info: _info,
            pic:_pic,
            exists: true
        });

        // candidates[_pic] = newCandidate;
        // candidate[_candidateName] = newCandidate;
        candidateNames.push(newCandidate);
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidateNames.length;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidateNames;
    }

    /*****************************CANDIDATES SECTION*****************************/

    /*****************************ELECTION SECTION*****************************/

    function setElectionDetails(string memory _name, string memory _description)
        public
        onlyAdmin
    {
        name = _name;
        description = _description;
        started = true;
        ended = false;
    }

    function getElectionName() public view returns (string memory) {
        return name;
    }

    function getElectionDescription() public view returns (string memory) {
        return description;
    }

    function getTotalCandidates() public view returns (uint256) {
        return candidateNames.length;
    }

    /*****************************ELECTION SECTION*****************************/

    /*****************************VOTER SECTION*****************************/

    struct Vote {
        address voterAddress;
        string voterId;
        string voterName;
        string candidate;
    }
    Vote[] votes;
    mapping(string => bool) public voterIds;
    string[] votersArray;

    function vote(
        string memory _voterId,
        string memory _voterName,
        string memory _candidateName
    ) public {
        require(started == true && ended == false);
        require(candidateExists(_candidateName), "No such candidate");        require(!voterIds[_voterId], "Already Voted");

        Vote memory newVote = Vote({
            voterAddress: msg.sender,
            voterId: _voterId,
            voterName: _voterName,
            candidate: _candidateName
        });

        votes.push(newVote);
        voterIds[_voterId] = true;
        votersArray.push(_voterId);
    }

    function getVoters() public view returns (string[] memory) {
        return votersArray;
    }

    /*****************************VOTER SECTION*****************************/

    function getVotes() public view onlyAdmin returns (Vote[] memory) {
        return votes;
    }

    function getTotalVoter() public view returns (uint256) {
        return votersArray.length;
    }

    function endElection() public onlyAdmin {
        require(started == true && ended == false);

        started = true;
        ended = true;
    }
function resetElection() public onlyAdmin {
    require(started == true && ended == true);

    // reset election details
    name = "";
    description = "";
    started = false;
    ended = false;

    // reset candidates
    delete candidateNames;

    // reset votes
    delete votes;

    // reset voters
    for (uint256 i = 0; i < votersArray.length; i++) {
        delete voterIds[votersArray[i]];
    }
    delete votersArray;
}


    function getStatus() public view returns (string memory) {
        if (started == true && ended == true) {
            return "finished";
        }

        if (started == true && ended == false) {
            return "running";
        }

        return "not-started";
    }

    function candidateExists(string memory _name) public view returns (bool) {
    for (uint256 i = 0; i < candidateNames.length; i++) {
        if (
            keccak256(abi.encodePacked(candidateNames[i].name)) ==
            keccak256(abi.encodePacked(_name))
        ) {
            return true;
        }
    }

    return false;
}
}



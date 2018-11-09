pragma solidity ^0.4.23;

import "./Ownable.sol";
import { MerkleProof } from "./MerkleProof.sol";

contract Checkpoint is Ownable {
  address public owner;
  uint256 public checkpointId = 0;

  mapping(uint256 => uint256) public checkpoints;

  event LogCheckpoint(uint256 indexed checkpointId);

  // TODO: owner should be multisig of nodes
  constructor(address _owner) public {
    transferOwnership(_owner);
  }

  // TODO: pass sigs and check sigs of root provided
  function checkpoint(uint256 root) public onlyOwner {
    checkpoints[checkpointId] = root;

    emit LogCheckpoint(checkpointId);
    checkpointId++;
  }

  function verify(
    bytes32[] proof,
    bytes32 root,
    bytes32 leaf
  )
    public
    pure
    returns (bool)
  {
    return MerkleProof.verify(proof, root, leaf);
  }
}

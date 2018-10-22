pragma solidity ^0.4.23;

import "./Ownable.sol";

contract Checkpoint is Ownable {
  address public owner;
  uint256 public checkpointId = 0;

  mapping(uint256 => bytes32) public checkpoints;

  event LogCheckpoint(uint256 indexed checkpointId);

  constructor(address _owner) public {
    transferOwnership(_owner);
  }

  // TODO: merkle proof verification
  function checkpoint(bytes32 root) public {
    checkpoints[checkpointId] = root;

    emit LogCheckpoint(checkpointId);
    checkpointId++;
  }
}

// List of tools
import {
  deleteJobApplication,
  getAllJobAplication,
  getDetailJobAplication,
  updateJobApplicationStatus,
} from "./admin-crud-apps";
import { createJob, deleteJob, updateJob } from "./admin-crud-jobs";
import {
  deleteUser,
  getAllUsers,
  getDetailUser,
  updateUser,
} from "./admin-crud-users";
import { health, index, login, register } from "./general-public-tool";
import {
  applyJob,
  getSelfDetailApplication,
  updateSelfJobApplication,
} from "./user-crud-apps";

const ADMIN_TOOL_LIST = [
  createJob,
  updateJob,
  deleteJob,
  getAllJobAplication,
  getDetailJobAplication,
  deleteJobApplication,
  updateJobApplicationStatus,
  getAllUsers,
  getDetailUser,
  updateUser,
  deleteUser,
];

const USER_TOOL_LIST = [
  applyJob,
  getSelfDetailApplication,
  updateSelfJobApplication,
];

const PUBLIC_TOOL_LIST = [register, login, index, health];

export const TOOL_LIST = [
  ...PUBLIC_TOOL_LIST,
  ...ADMIN_TOOL_LIST,
  ...USER_TOOL_LIST,
];

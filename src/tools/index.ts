// List of tools
import {
  deleteJobApplication,
  getAllJobAplication,
  getDetailJobAplication,
  updateJobApplicationStatus,
} from "./admin-crud-apps";
import { createJob, deleteJob, updateJob } from "./admin-crud-jobs";
import { health, index, login } from "./general-public-tool";
import {
  applyJob,
  getAppliedJob,
  updateJobApplication,
} from "./user-crud-apps";

const ADMIN_TOOL_LIST = [
  createJob,
  updateJob,
  deleteJob,
  getAllJobAplication,
  getDetailJobAplication,
  deleteJobApplication,
  updateJobApplicationStatus,
];

const USER_TOOL_LIST = [applyJob, getAppliedJob, updateJobApplication];

const PUBLIC_TOOL_LIST = [login, index, health];

export const TOOL_LIST = [
  ...PUBLIC_TOOL_LIST,
  ...ADMIN_TOOL_LIST,
  ...USER_TOOL_LIST,
];

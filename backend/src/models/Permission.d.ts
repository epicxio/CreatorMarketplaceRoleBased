import { Document, Model } from 'mongoose';

export interface IPermission extends Document {
  _id: string;
  name: string;
  resource: string;
  action: string;
}

declare const Permission: Model<IPermission>;

export default Permission; 
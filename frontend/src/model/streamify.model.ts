export type Id<T extends {}> = { id: number } & T;

export type Credentials = {
  email: string;
  password: string;
};

export type Profile = {
  name: string;
  lastName: string;
} & Credentials;

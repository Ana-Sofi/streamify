export type Passwordless<T extends {password: string}> = Omit<T, 'password'>;

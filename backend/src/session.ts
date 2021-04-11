import {User} from './model';

export type SessionKey = string;
export type Session<T> = Map<SessionKey, T>;

import { signal } from "@angular/core"

interface LoginData {
  email : string,
  password : string
}

export const loginModel = signal<LoginData>({
  email : '',
  password: ''
});

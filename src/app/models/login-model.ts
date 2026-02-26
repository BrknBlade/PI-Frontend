import { signal } from "@angular/core"

interface LoginData {
  name : string,
  password : string
}

export const loginModel = signal<LoginData>({
  name : '',
  password: ''
});

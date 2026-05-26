import { signal } from "@angular/core"

interface RegisterData {
  name : string,
  email : string,
  password : string
}

export const registerModel = signal<RegisterData>({
  name: '',
  email : '',
  password: ''
});

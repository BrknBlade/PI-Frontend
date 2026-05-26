import { Component, DoCheck, inject, signal } from '@angular/core';
import { UserData } from '../../../services/userData/user-data';
import { CutData } from '../../../services/cutData/cut-data';


@Component({
  selector: 'app-clients-component',
  imports: [],
  templateUrl: './clients-component.html',
  styleUrl: './clients-component.css',
})
export class ClientsComponent implements DoCheck{
  //importar servicio info bussines
  userService = inject(UserData);
  cutService = inject(CutData);

  arrInfo = signal<any[]>([]);
  arrBusqueda = signal<any[]>([]);
  busqueda:any = '';
  resolucionWidth = signal(window.innerWidth);

  cargando = signal(true);

  timestampActual = Date.now() - 60 * 60 * 24 * 7 * 1000;// el por mil es pq es en milisegundos lo q delvuelve now()
  constructor(){
    this.infoBusinness();

    console.log(this.resolucionWidth);
  }

  ngDoCheck(): void {
      window.addEventListener('resize', () => {
      this.resolucionWidth.set(window.innerWidth);
    })
  }

  infoBusinness(){
    this.getClientsNameContact();
  }

  buscador(){
    this.arrBusqueda.set([...this.arrInfo()]);
    let input = document.querySelector('form input') as HTMLInputElement;
    this.busqueda = input.value;

    let filtrados = this.arrInfo().filter( user => {
      let nombre = user.name as String;
      let email = user.email as String;
      return nombre.toLowerCase().includes(this.busqueda) || email.toLowerCase().includes(this.busqueda);
    })

    this.arrBusqueda.set(filtrados);
  }

  getClientsCitas() {
  this.userService.getCitas().subscribe(() => {
    const clientes = this.arrInfo();
    let clientesCompletados = 0;

    for (const element of clientes) {
      this.userService.getCitasEachClient(element.id).subscribe(async e => {
        const citas = e.data.filter((cita: any) => cita.user_id == element.id);
        let citasCompletadas = 0;
        let precioTotal = 0;

        if (citas.length === 0) {
          this.arrInfo.update(valor =>
            valor.map(client =>
              client.id === element.id ? { ...client, totalCitas: 0, precioTotal: 0 } : client
            )
          );
          clientesCompletados++;
          return;
        }

        for (const cita of citas) {
          this.cutService.getCut(cita.cut_type_id).subscribe(res => {
            precioTotal += Number(res.data.price);
            citasCompletadas++;

            if (citasCompletadas === citas.length) {
              this.arrInfo.update(valor =>
                valor.map(client =>
                  client.id === element.id
                    ? { ...client, totalCitas: citas.length, precioTotal }
                    : client
                )
              );
              clientesCompletados++;

              if (clientesCompletados === clientes.length) {
                this.cargando.set(false);
                //console.log('Array final:', this.arrInfo());
              }
            }
          });
        }
      });
    }
  });
}

getClientsNameContact(){
  this.userService.getAll().subscribe((response: any) => {
    const users = response.data ?? response;

    const clientes = users.filter((user: any) => user.role == 3);

    clientes.forEach((user: any) => {
      user.created_at = new Date(user.created_at).getTime();
    });

    this.arrInfo.set(clientes);
    this.getClientsCitas();
  });
}

  /*getClientsNameContact(){
    this.userService.getAll().subscribe(async users =>{
      for (const user in users) {
        let usuario = users[user];
        for (const data in usuario) {
          const info: any = usuario[data];
          console.log(this.arrInfo())
          console.log(info)

          if(info.role == 4){//deberia de ser role == 4 pero uso 3 por tener un par de resultados
            info.created_at = new Date(info.created_at).getTime();
            this.arrInfo.update(val => {

              return [...val, info];
            });
          }
        }
      }
      this.getClientsCitas();
    });
  }*/

}

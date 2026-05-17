import { Component, DoCheck, inject, signal } from '@angular/core';
import { UserData } from '../../services/userData/user-data';
import { CutData } from '../../services/cutData/cut-data';


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
  arrBusqueda= signal<any[]>([]);

  cargando = signal(true);

  timestampActual = Date.now() - 60 * 60 * 24 * 7 * 1000;// el por mil es pq es en milisegundos lo q delvuelve now()

  ngDoCheck(): void {
    this.infoBusinness();
  }
  infoBusinness(){
    this.getClientsNameContact();
    this.getClientsCitas();
  }

  buscador(){
    let input = document.querySelector('form input') as HTMLInputElement;
    let busqueda = input.value;

    for (const user of this.arrInfo()) {
      let nombre:string = user.name;
      let email:string = user.email;
      if((nombre.includes(busqueda) || email.includes(busqueda))){
        console.log('Filtro lo pasa', user)
        //this.arrInfo().splice() CONTINUAR
      }
    }
    console.log(this.arrInfo());
  }

  getClientsCitas() {
  this.userService.getCitas().subscribe(() => {
    const clientes = this.arrInfo();
    let clientesCompletados = 0;

    for (const element of clientes) {
      this.userService.getCitasEachClient(element.id).subscribe(e => {
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
    this.userService.getAll().subscribe(users =>{
      for (const user in users) {
        let usuario = users[user];
        for (const data in usuario) {
          const info: any = usuario[data];
          if(info.role == 3){//deberia de ser role == 4 pero uso 3 por tener un par de resultados
            info.created_at = new Date(info.created_at).getTime();
            this.arrInfo.update(val => {
              return [...val, info];
            });
          }
        }
      }
    });
  }

}

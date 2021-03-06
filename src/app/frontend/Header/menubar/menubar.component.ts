import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { PERIODICELEMENT_LIST, ErrorListService } from 'src/app/service/ajax/error-list.service';
import { SocketIOService } from 'src/app/service/socketIO/socket-io.service';
import { Router } from '@angular/router';
import { AllServerStateService } from 'src/app/service/allServerState/all-server-state.service';
import { MuleChartService } from 'src/app/service/muleChart/mule-chart.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit,OnChanges {

  @Input()
  tabledata:PERIODICELEMENT_LIST[];
  passdata:PERIODICELEMENT_LIST[];
  umgebung:string;

  constructor(
    private socket:SocketIOService,
    private allServerState:AllServerStateService,
    private muleState:MuleChartService,
    private errorList:ErrorListService,
    private _router:Router
    ) {}

  ngOnChanges(changes: SimpleChanges){
    if(changes['tabledata']){this.passdata = this.tabledata;}
  }

  onToggleSidenav(env:string){
    if(env){
      let user = localStorage.getItem("user");
    let obj:object = {
      "oldenv":this.umgebung.toLowerCase(),
      "newenv":env.toLowerCase(),
      "user":user
    };
    this.socket.callSocket('update',obj);
    this.umgebung = env.toLocaleUpperCase();
    localStorage.setItem("env",env);
    }
  }

  ngOnInit() {
    this.socket.getMessage().subscribe(
      (message)=>{
        let env = message;
        this.umgebung = env.toLocaleUpperCase();
      }
    )

  }

}

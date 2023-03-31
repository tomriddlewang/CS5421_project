import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public forecasts?: WeatherForecast[];

  isDataReady: boolean = false;
  schemas: ISchema[] = [];

  constructor(http: HttpClient) {
    //http.get<WeatherForecast[]>('/weatherforecast').subscribe(result => {
    //  this.forecasts = result;
    //}, error => console.error(error));
  }

  title = 'angularapp';

  ngOnInit(){
    console.log("AHHHHHHHHA");
    this.schemas.push({
      name: 'schema0',
      attributes: [
        {
          attrName: 'id',
          type: 'GUID',
          options: new Map()
        }
      ]
    });
  }

  addSchema(){
    console.log(JSON.stringify(this.schemas));
    this.schemas.push({
      name: 'schema'+this.schemas.length,
      attributes: [
        {
          attrName: 'id',
          type: 'GUID',
          options: new Map()
        }
      ]
    });
  }

  addAttr(schema: ISchema){
    schema.attributes.push(
      {
        attrName:'NewAttribute',
        type:'',
        options: new Map()
      }
    );
  }

  delSchema(i:number){
    this.schemas.splice(i, 1);
  }


  showConfig(){
    
  }

}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface ISchema {
  name: string;
  attributes: IAttribute[];
}

interface IAttribute {
  attrName: string;
  type: string;
  options: Map<string, string>;
}

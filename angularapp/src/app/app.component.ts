import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  allAttrTypeList = ['country','city','address',
  'name','age','gender','phone_number','email','company'];

  isDataReady: boolean = false;
  entities: IEntity[] = [];
  relations: IRelation[] = [];


  constructor(http: HttpClient) {
    //http.get<WeatherForecast[]>('/weatherforecast').subscribe(result => {
    //  this.forecasts = result;
    //}, error => console.error(error));
  }

  title = 'angularapp';

  ngOnInit(){
    this.entities.push({
      name: '',
      // attributes: new Map<string, string>(),
      attributes: [
        {
          attrName:'attr',
          attrType:'id',
          attrIsPK: false
        }
      ],
      rows: 50
    });
  }

  addEntity(){
    console.log(JSON.stringify(this.entities));
    this.entities.push({
      name: '',
      // attributes: new Map<string, string>(),
      attributes: [
        {
          attrName:'attr',
          attrType:'id',
          attrIsPK: false
        }
      ],
      rows: 50
    });
  }

  addAttr(entity: IEntity){
    entity.attributes.push({
      attrName:'',
      attrType:'',
      attrIsPK: false
    });
    console.log(entity);
  }

  delEntity(i:number){
    this.entities.splice(i, 1);
  }

  onChangeEntityName(entity: IEntity, event: any){
    entity.name = event.target.value;
  }
  onChangeAttrName(attribute:IAttribute, event:any){
    attribute.attrName = event.target.value;
  }

  onChangeAttrType(attribute:IAttribute, event:any){
    attribute.attrType = event.target.value;
  }

  onChangeAttrIsPK(attribute:IAttribute, event:any){
    if(event.target.value=='true'){
      attribute.attrIsPK = true;
    } else{
      attribute.attrIsPK = false;
    }
  }

  delAttr(attributes:IAttribute[], j:number){
    attributes.splice(j,1);
  }

  onChangeRows(entity: IEntity, event: any){
    entity.rows = event.target.value; // TODO: to number
  }

  

}


interface IEntity {
  name: string;
  // attributes: Map<string, string>; // attr_name: type
  attributes: IAttribute[];
  rows: number;

}

interface IAttribute {
  attrName: string;
  attrType: string;
  attrIsPK: boolean;
}

interface IRelation {
  name: string;
  // related: 
  attributes: IRelationAttribute[];
  cardinality: string; //?
  // participation:
  selectivity: number;
}

interface IRelationAttribute{
  attrName: string;
  attrReferenceEntity: IEntity;
  attrReferenceAttr: IAttribute;
  attrIsPK: boolean;
}

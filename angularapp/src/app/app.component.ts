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

  finalResult: string = ''; 


  constructor(private http: HttpClient) {
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
    entity.rows = +(event.target.value); // TODO: to number
  }

  addRelation(){
    console.log(JSON.stringify(this.relations));
    this.relations.push({
      name: '',
      related: [],
      attributes: [],
      cardinality: 'one-to-many',
      participation: new Map<string, boolean>(),
      selectivity: 1
    });
  }

  onChangeRelationName(relation: IRelation, event: any){
    relation.name = event.target.value;
  }

  onChangeRelateEntity(relation: IRelation, event: any, index: number){
    relation.related[index-1] = this.entities[event.target.value];
    relation.participation.set(this.entities[event.target.value].name, true);
    // console.log(relation.related)
    // console.log(event.target.value)
  }

  delRelation(i:number){
    this.relations.splice(i, 1);
  }

  addRelationAttr(relation: IRelation){
    relation.attributes.push({
      attrName:'',
      attrReferenceEntity:{
        name: '',
        attributes: [
          {
            attrName:'',
            attrType:'',
            attrIsPK: false
          }
        ],
        rows: -1
      },
      attrReferenceAttr:{
        attrName:'',
        attrType:'',
        attrIsPK: false
      },
      attrIsPK: false
    });
  }

  onChangeRelationAttrName(attribute:IRelationAttribute, event:any){
    attribute.attrName = event.target.value;
  }

  delRelationAttr(attributes:IRelationAttribute[], j:number){
    attributes.splice(j,1);
  }

  onChangeRelationAttrReferenceEntity(attribute:IRelationAttribute, related: IEntity[], event: any){
    attribute.attrReferenceEntity = related[event.target.value]
  }

  onChangeRelationAttrReferenceAttr(attribute:IRelationAttribute, attributes: IAttribute[], event: any){
    attribute.attrReferenceAttr = attributes[event.target.value]
  }

  onChangeRelationAttrIsPK(attribute:IRelationAttribute, event: any){
    if(event.target.value=='true'){
      attribute.attrIsPK = true;
    } else{
      attribute.attrIsPK = false;
    }
  }

  onChangeRelationCardinality(relation: IRelation, event:any){
    relation.cardinality = event.target.value;
  }

  onChangeRelationSelectivity(relation: IRelation, event:any){
    relation.selectivity = +event.target.value;
  }

  onChangeRelateEntityParticipation(relation:IRelation,event:any, index:number){
    if(event.target.value=='true'){
      relation.participation.set(relation.related[index-1].name, true)
    } else{
      relation.participation.set(relation.related[index-1].name, false)
    }
  }

  submit(){
    let index = 0;
    this.finalResult = 'loading'
    let finalInput = new Map<string, any>();
    this.entities.forEach(function (entity) {
      let tempAttributes = new Map<string, string>();
      let tempprimary_key:string[] = [];
      entity.attributes.forEach(function (attribute){
        tempAttributes.set(attribute.attrName, attribute.attrType);
        if(attribute.attrIsPK){
          tempprimary_key.push(attribute.attrName);
        }
      });
      finalInput.set(index.toString(),{
        name: entity.name,
        type: 'entity',
        attributes: Object.fromEntries(tempAttributes),
        primary_key: tempprimary_key,
        rows: entity.rows,
      });

      index++;
    });
    this.relations.forEach(function (relation) {
      let tempRelated: string[] = [];
      let tempAttributes: string[] = [];
      let tempprimary_key:string[] = [];
      let tempreference: Map<string, any> = new Map<string, any>();
      relation.related.forEach(function (relateditem){
        tempRelated.push(relateditem.name);
      });
      relation.attributes.forEach(function (attribute){
        tempAttributes.push(attribute.attrName);
        if(attribute.attrIsPK){
          tempprimary_key.push(attribute.attrName);
        }
        if(attribute.attrReferenceEntity.rows !=-1){
          let temptempmap: Map<string, string> =  new Map<string, string>();
          temptempmap.set(attribute.attrReferenceEntity.name, attribute.attrReferenceAttr.attrName);
          tempreference.set(attribute.attrName, Object.fromEntries(temptempmap))
        }
      });
      finalInput.set(index.toString(),{
        name: relation.name,
        type: 'relation',
        related: tempRelated,
        attributes: tempAttributes,
        primary_key: tempprimary_key,
        reference: Object.fromEntries(tempreference),
        cardinality: relation.cardinality,
        participation: Object.fromEntries(relation.participation),
        selectivity: relation.selectivity
      });

      index++;
    });

    console.log(JSON.stringify(Object.fromEntries(finalInput)));

    // let headers = { 'Access-Control-Allow-Origin': 'http://localhost:4200'}
    this.http.post<any>('http://localhost:5000/random_data_json', Object.fromEntries(finalInput)).subscribe(data=>{
      console.log(JSON.stringify(data));
      this.finalResult = JSON.stringify(data)
    });
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
  related: IEntity[],
  attributes: IRelationAttribute[]; // attributes, primary_key, reference
  cardinality: string;
  participation: Map<string, boolean>;
  selectivity: number;
}

interface IRelationAttribute{
  attrName: string;
  attrReferenceEntity: IEntity;
  attrReferenceAttr: IAttribute;
  attrIsPK: boolean;
}

from flask import Flask
from flask import request
from faker import Faker
import json
from types import SimpleNamespace
import pandas as pd
import numpy as np

app = Flask(__name__)
fake = Faker()

if __name__ == '__main__':
    # app.run()
    print()

geo_attr_list=['country','city','address']
personal_attr_list=['name','age','gender','phone_number','email','company']
distribution_list=['normal','exponential','triangular']
dependencies=[['city','country']]
df = pd.read_excel('api\worldcities.xlsx','Sheet1')
df_country_city=df[['country','city_ascii','population']]
df_country_city=df_country_city.rename(columns={'city_ascii':'city'})
print(df_country_city)

def get_random(method, *params):
    if method=='normal':
        return np.random.normal(*params)
    elif method=='exponential':
        return np.random.exponential(*params)
    elif method=='triangular':
        return np.random.triangular(*params)



@app.route('/data')
def get_data():
    data = {'foo': 'bar'}
    return data

# @app.route('/random_data_json', methods=['POST'])
# def post_random_data():
#     input = request.get_json()
#     schemas=SchemasInput(json.dumps(input))
#     first_schema = schemas.schemas[0]
#     df = pd.DataFrame()
#     for attr in first_schema['attributes']:
#         generate_column(attr['attrName'],schemas.rows,df)
#     return df.to_csv()



def generate_columns(d,r,df):
    if list(d.values()) == ['city','country']:
        df.set_axis(d.keys())
        for i in range(r):
            rng_index=int(np.round(get_random('exponential',0.01) * 42904))
            df.loc[i,list(d.keys())[1]]=df_country_city.loc[rng_index,'country']
            df.loc[i,list(d.keys())[0]]=df_country_city.loc[rng_index,'city']

def generate_column(k,v,r,df):
    # todo primary key
    if k in df.columns:
        return
    if v=='country':
        for i in range(r):
            rng_index=int(np.round(get_random('exponential',0.01) * 42904))
            df.loc[i,k]=df_country_city.loc[rng_index,'country']
    elif v=='city':
        for i in range(r):
            rng_index=int(np.round(get_random('exponential',0.01) * 42904))
            df.loc[i,k]=df_country_city.loc[rng_index,'city']
    elif v=='address':
        for i in range(r):
            df.loc[i,k]=fake.street_address()
    elif v=='name':
        for i in range(r):
            df.loc[i,k]=fake.name()
    elif v=='gender':
        for i in range(r):
            if np.random.random() > 1/2:
                df.loc[i,k]='M'
            else:
                df.loc[i,k]='F'
    elif v=='age':
        for i in range(r):
            df.loc[i,k]=int(get_random('triangular',0,30,100))
    elif v=='phone_number':
        for i in range(r):
            df.loc[i,k]=fake.phone_number()
    elif v=='email':
        for i in range(r):
            df.loc[i,k]=fake.email()
    elif v=='company':
        for i in range(r):
            df.loc[i,k]=fake.company()
    elif v=='id':
        for i in range(r):
            id=fake.random_int()
            while k in df.columns and id in df[k]:
                id=fake.random_int()
            df.loc[i,k]=id


def test_method():
    rows=10
    columns=['country','city','address','name','age','gender','phone_number','email','company']
    df = pd.DataFrame()
    for dependency in dependencies:
        if all(column in columns for column in dependency):
            for elem in dependency:
                columns.remove(elem)
        generate_columns(dependency,rows,df)
    for c in columns:
        generate_column(c,rows,df)
    print(df)

with open('api/json_example.json','r') as f:
    json_example=json.load(f)
print(json_example)
# todo link with api, required fields are as above
def multiple_tables(request_json):
    store=dict()
    for key,value in request_json.items():
        if value['type'] == 'entity':
            df = pd.DataFrame()
            attributes=value['attributes'].copy()
            types=list(value['attributes'].values()).copy()
            dep=dict()
            for dependency in dependencies:
                if all(column in types for column in dependency):
                    for elem in dependency:
                        k=list(attributes.keys())[list(attributes.values()).index(elem)]
                        dep.update({k:attributes[k]})
                generate_columns(dep,value['rows'],df)
            for k,v in attributes.items():
                generate_column(k,v,value['rows'],df)
            print(value['name'])
            print(df)
            store.update({value['name']:df})
        elif value['type'] == 'relation':
            df = pd.DataFrame()
            related=value['related'].copy()
            attributes=value['attributes'].copy()
            df.set_axis(attributes)
            selectivity=value['selectivity']
            participation=value['participation']
            reference=value['reference']
            for part_k,part_v in participation.items():
                if part_v:
                    for ref_k,ref_v in reference.items():
                        for ref_table, ref_column in ref_v.items():
                            if ref_table==part_k:
                                df[ref_k]=store[ref_table][ref_column]
                                attributes.remove(ref_k)
                                if ref_table in related:
                                    related.remove(ref_table)
            for remain_table in related:
                size = int(len(df.index)*selectivity)
                rng_index_list=[]
                for _ in range(size): 
                    rng_index_list.append(int(np.random.random()*(len(store[remain_table]))))
            for attr in attributes:
                for ref_k,ref_v in reference.items():
                    if attr == ref_k:
                        for ref_table, ref_column in ref_v.items():
                            for i in range(len(df.index)):
                                df.loc[i,attr]=store[ref_table].loc[rng_index_list[i%size],ref_column]
            print(value['name'])
            print(df)
        
                        
                        



multiple_tables(json_example)

# test_method()


class SchemasInput(object):
    def __init__(self, j):
        self.__dict__ = json.loads(j)
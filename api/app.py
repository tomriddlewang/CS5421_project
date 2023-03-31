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
df = pd.read_excel('worldcities.xlsx','Sheet1')
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

@app.route('/random_data_json', methods=['POST'])
def post_random_data():
    input = request.get_json()
    schemas=SchemasInput(json.dumps(input))
    first_schema = schemas.schemas[0]
    df = pd.DataFrame()
    for attr in first_schema['attributes']:
        generate_column(attr['attrName'],schemas.rows,df)
    return df.to_csv()



def generate_columns(d,r,df):
    if d == ['city','country']:
        df.set_axis(d)
        for i in range(r):
            rng_index=int(np.round(get_random('exponential',0.01) * 42904))
            df.loc[i,'country']=df_country_city.loc[rng_index,'country']
            df.loc[i,'city']=df_country_city.loc[rng_index,'city']

def generate_column(c,r,df):
    if c=='country':
        for i in range(r):
            rng_index=int(np.round(get_random('exponential',0.01) * 42904))
            df.loc[i,'country']=df_country_city.loc[rng_index,'country']
    elif c=='city':
        for i in range(r):
            rng_index=int(np.round(get_random('exponential',0.01) * 42904))
            df.loc[i,'city']=df_country_city.loc[rng_index,'city']
    elif c=='address':
        for i in range(r):
            df.loc[i,c]=fake.street_address()
    elif c=='name':
        for i in range(r):
            df.loc[i,c]=fake.name()
    elif c=='gender':
        for i in range(r):
            if np.random.random() > 1/2:
                df.loc[i,c]='M'
            else:
                df.loc[i,c]='F'
    elif c=='age':
        for i in range(r):
            df.loc[i,c]=int(get_random('triangular',0,30,100))
    elif c=='phone_number':
        for i in range(r):
            df.loc[i,c]=fake.phone_number()
    elif c=='email':
        for i in range(r):
            df.loc[i,c]=fake.email()
    elif c=='company':
        for i in range(r):
            df.loc[i,c]=fake.company()


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


test_method()


class SchemasInput(object):
    def __init__(self, j):
        self.__dict__ = json.loads(j)
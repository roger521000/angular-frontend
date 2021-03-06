import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class WebAPI {
  database = firebase.database();

  constructor() { }

  getBeacons(school:string): firebase.Promise<any>
  {
    return new Promise((resolve,reject) =>
    {
      this.database.ref('/beacon/').once('value').then( res =>
      {
        var beacons = [];
        var validSchoolNames = [];
        if (school != null)
        {
          validSchoolNames.push(school);
          this.getSchoolNameSubstr(school).then(schoolNames => {
            var x = 0;
            for (var i in schoolNames)
            {
              x++;
              validSchoolNames.push(schoolNames[i]);
            }
            console.log(x);
          })
          console.log(validSchoolNames);

          for (var i = 0; i < validSchoolNames.length; i++)
          {
            console.log(validSchoolNames[i]);
          }
        }
        if (school != null)
        {
          for (let key in res.val())
          {
            if (validSchoolNames.includes(res.val()[key].school))
            {
              beacons.push(res.val()[key]);
            }
          }
          // console.log(beacons);
        }
        else
        {
          for (let key in res.val()){
            beacons.push(res.val()[key]);
          }
        }
        console.log(beacons);
        resolve(beacons);
      });
    }).catch(err => console.log(err))
  }

  // function 1: get any school name that contains the given school name or is contained within the given school name
  // ex. ("Laurier" == "wilfrid laurier university")
  getSchoolNameSubstr(school_name)
  {
    return new Promise((resolve,reject)=>{
      var s=this.database.ref('/beacon/').once('value').then(function(b)
      {
        var uppcase=school_name.toUpperCase();                                          // make the parameter uppercase and its called uppcase
        var len=uppcase.length;
        var camp;
        var t =[];
        var temp;
        var flag = false;
        //alert('agg');
        if (uppcase !='university' && uppcase != 'of')
        {                                 // make sure when the user input university and of, it return nothing.
          for(var i in b.val())
          {
            if (b.val()[i].school != undefined)
            {
              camp=b.val()[i].school.toUpperCase();                                // making the string to uppercase
              if (camp==uppcase)
              {
                flag= true;
              }
              temp=camp.split(' ');                                                // splitting the string
              for (var tx in temp)
              {
                if (temp[tx].toUpperCase()==uppcase)
                {                            // comparing the string
                  flag = true;
                }
              }
              if (flag == true)
              {                                                     // if string contains the given school name, then this string will be pushed into array.
                t.push(b.val()[i].school);
                flag = false;
              }
            }
          }
        }
        console.log("t", t);
        resolve(t);
      });
    })
  }

  getUserById(id:string){

  }

  getUserByEmail(email:string):Promise<any>{
    return new Promise((resolve,reject) => {
      this.database.ref("user").orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
        resolve(snapshot);
      });
    }).catch(err => console.log(err))
  }
}

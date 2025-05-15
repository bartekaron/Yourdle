import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })

  export class ApiService {

    constructor(private http: HttpClient) { }

    private tokenName = environment.tokenName;
    private server = environment.serverUrl;

    getToken():String | null{
      return localStorage.getItem(this.tokenName);
    }

    tokenHeader(): { headers: HttpHeaders } {
      const token = this.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return { headers };
  }


    registration(data:object){
      return this.http.post(this.server + '/users/register', data);
    }

    login(data:object){
      return this.http.post(this.server + '/users/login', data);
    }

    read(table: string, field:string, op: string, value: string){
      return this.http.get(this.server + '/public/'+table+'/'+field+'/'+op+'/'+value);
    }

    updatePasswd(table: string, field:string, op: string, value: string, data:object){
      return this.http.patch(this.server + '/public/'+table+'/'+field+'/'+op+'/'+value, data);
    }

    uploadLeaderboard(data: object){
      return this.http.post(this.server + "/games/leaderboard", data, this.tokenHeader())
    }

    getLeaderboard(){
      return this.http.get(this.server + "/games/leaderboard")
    }

    getLeaderboardOneUser(id: string){
      return this.http.get(this.server + "/games/leaderboard/" + id, this.tokenHeader());
    }

    // token-el védett metódusok:

    select(table: string, field:string){
      return this.http.get(this.server + '/'+table+'/'+field, this.tokenHeader());
    }

    selectAll(table: string){
      return this.http.get(this.server + '/' + table, this.tokenHeader());
    }

    insert(table: string, data:object){
      return this.http.post(this.server + '/'+table, data, this.tokenHeader());
    }

    update(table:string, id:string, data:object){
      return this.http.patch(this.server + '/'+table + '/' +id, data, this.tokenHeader());
    }

    delete(table:string, id:string){
      return this.http.delete(this.server + '/'+table+ '/' +id, this.tokenHeader());
    }

    delete2(table:string, name:string){
      return this.http.delete('http://localhost:3000/' +table +'/' + name, this.tokenHeader());
    }

    deleteByEmail(email:string){
      return this.http.delete(this.server + '/users/delete/' + email, this.tokenHeader());
    }

    editUser(id: string, data: object) {
      return this.http.patch(this.server + '/users/edit/' + id, data, this.tokenHeader());
    }

    forgottPassword(data:object){
      return this.http.post(this.server + '/forgott-password', data);
    }

    

    getAllUsers(){
      return this.http.get(this.server + '/users/allUsers', this.tokenHeader());
    }

    uploadFile(profilePicture:File, id:string){
      const formData = new FormData();
      formData.append('profilePicture', profilePicture);
      formData.append('id', id);
      console.log(formData);
      return this.http.post('http://localhost:3000/'+ 'uploadProfilePicture', formData, this.tokenHeader());
    }

    deleteFile(file:File){
      return this.http.delete(this.server + '/delete'+file, this.tokenHeader());
    }

    post(name:string, data:object){
      return this.http.post('http://localhost:3000/' + name, data, this.tokenHeader());
    }

    profileSave(data: object) {
      return this.http.patch(this.server + '/users/profile', data, this.tokenHeader());
    }

    deleteProfilePicture(id: string) {
      return this.http.delete(this.server + '/users/deleteProfilePicture/' + id, this.tokenHeader());
    }
    
    MatchHistory(id: string) {
      return this.http.get(this.server + '/users/history/' + id, this.tokenHeader());
    }
    
    ChangePassword(id: string, data: object) {
      return this.http.patch(this.server + '/users/change-password/' + id, data, this.tokenHeader());
    }
   
    getUserById(userID: string): Observable<any> {
      return this.http.get<any>(this.server + '/users/user/' + userID, this.tokenHeader());
    }
  
    
   //Kategóriákhoz tartozó metódusok

    getPublicCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.server + '/categories/allPublicCategories');
    }

    getCategoryByID(id: string): Observable<any> {
      return this.http.get(this.server + '/categories/category/' + id);
    }

    getUser(id: string) {
      return this.http.get(this.server + '/users/' + id, this.tokenHeader());
    }

    createCategory(data: object) {
      return this.http.post(this.server + '/categories/category', data, this.tokenHeader());
    }

    getAllCategory(){
      return this.http.get(this.server + "/categories/allCategory", this.tokenHeader());
    }
  
    getCategoryData(id: string){
      return this.http.get(this.server + "/categories/data/" + id, this.tokenHeader());
    }
  
    deleteCategory(id:string){
      return this.http.delete(this.server + "/categories/" + id, this.tokenHeader());
    }

    createClassic(data: object): Observable<any> {
      return this.http.post(this.server + '/categories/classic', data, this.tokenHeader());
    }
  
    createDescription(data: object): Observable<any> {
      return this.http.post(this.server + '/categories/description', data, this.tokenHeader());
    }
  
    createQuote(data: object): Observable<any> {
      return this.http.post(this.server + '/categories/quote', data, this.tokenHeader());
    }
  
    createPicture(data: object): Observable<any> {
      return this.http.post(this.server + '/categories/picture', data, this.tokenHeader());
    }
  
    createEmoji(data: object): Observable<any> {
      return this.http.post(this.server + '/categories/emoji', data, this.tokenHeader());
    }

    uploadCategoryPicture(picture: File, answer: string, categoryID: string): Observable<any> {
      const formData = new FormData();
      formData.append('picture', picture);
      formData.append('answer', answer);
      formData.append('categoryID', categoryID);
      return this.http.post('http://localhost:3000/'+'uploadCategoryPicture', formData, this.tokenHeader());
    }
    
  //Játékokhoz tartozó metódusok

   getAllClassic(id: string) {
    return this.http.get(this.server + '/games/allClassic/' + id);
   }

  getSolutionClassic(id: string) {
    return this.http.get(this.server + '/games/solutionClassic/' + id);
  }

  getAllEmoji(id: string) {
    return this.http.get(this.server + '/games/allEmoji/' + id);
   }

  getSolutionEmoji(id: string) {
    return this.http.get(this.server + '/games/solutionEmoji/' + id);
  }

  getAllDescription(id: string) {
    return this.http.get(this.server + '/games/allDescription/' + id);
   }

  getSolutionDescription(id: string) {
    return this.http.get(this.server + '/games/solutionDescription/' + id);
  }

  getAllQuote(id: string) {
    return this.http.get(this.server + '/games/allQuote/' + id);
  }

  getSolutionQuote(categoryId: string): Observable<any> {
    return this.http.get(`${this.server}/games/solutionQuote/${categoryId}`).pipe(
      catchError(error => {
        console.error('Error in getSolutionQuote:', error);
        throw error;
      })
    );
  }

  getAllPicture(id: string) {
    return this.http.get(this.server + '/games/allPicture/' + id);
  }

  getSolutionPicture(id: string) {
    return this.http.get(this.server + '/games/solutionPicture/' + id);
  }

  saveMatchResult(matchData: object): Observable<any> {
    return this.http.post(this.server + '/games/saveMatchResult', matchData, this.tokenHeader());
  }

  updateResetToken(userId: string, token: string): Observable<any> {
    // Get current Budapest time (UTC+2)
    const budapestOffset = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const now = new Date();
    
    // Adjust for Budapest time zone
    const budapestTime = new Date(now.getTime() + budapestOffset);
    
    // Add 30 minutes for expiration
    const expirationDate = new Date(budapestTime.getTime() + 30 * 60 * 1000);
    
    // Format date in MySQL format (YYYY-MM-DD HH:MM:SS)
    const formatDate = (date: Date) => {
      const pad = (num: number) => String(num).padStart(2, '0');
      return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
    };
    
    const expiresAt = formatDate(expirationDate);
    
    console.log('Current time (Budapest):', formatDate(budapestTime));
    console.log('Token will expire at (Budapest):', expiresAt);
    
    const data = {
      reset_token: token,
      token_expires_at: expiresAt
    };
    
    return this.http.patch(this.server + '/public/users/id/eq/' + userId, data);
  }

}
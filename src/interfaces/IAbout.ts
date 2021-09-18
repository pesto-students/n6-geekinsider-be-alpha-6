/*
* These below interfaces is used to fill the about for multiple job description, candidate info, recruiter info
*/

export interface IAbout {
    about: string;  
    // This is the para that will be used for job search 
    // and candidiate recommendation engine to get the about insigiht based on what user has typed
}

// export interface IAbout {
//     _id: string;    // this will be the email id itself
//     about: string;  // This is the para that will be used for job search and candidiate remomned=ndation engine to get the about insigiht the user has typed
// }
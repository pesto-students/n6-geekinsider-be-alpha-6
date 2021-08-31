export interface ICandidate {
    _id: string;    // email id will be used as unique attribute for a given user
    name: string;
    whatsappNumber: string;
    skills:[];  
    jobtitle: string;
    aboutid: string; // about is corresponds to the id of the about section which will be used for better filtering in the search engine  
}
  
export interface ICandidateInputDTO {
    name: string;
    whatsappNumber: string;
    skills:[];  
    jobtitle: string;  
}
  
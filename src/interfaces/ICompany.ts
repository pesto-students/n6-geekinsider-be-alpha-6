export interface ICompany {
    //_id: string;
    name: string;
    whatsappNumber: string;
    preferredIndustry: string;
    location: string;
    skills:[];
    aboutid: string; // about is corresponds to the id of the about section which will be used for better filtering in the search engine  
}
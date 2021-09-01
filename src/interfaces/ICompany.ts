export interface ICompany {         // This will be used for the recruiter to fill their info.
    //_id: string;
    name: string;
    whatsappNumber: string;
    preferredIndustry: string;
    location: string;
    skills:[];
    aboutid: string;                // about is corresponds to the id of the about section which will be used for better filtering in the search engine  
    empSize: number;
    site: string;                   // This will be used to store the site of the company
}
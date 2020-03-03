

export const endpoint = `http://127.0.0.1:8000/api/`;


export const all_articles_url =     endpoint+`all-articles/` ;
export const article_url = (id) =>  endpoint+`article/`+id+`/` ;

export const create_article_url = endpoint+ `create-article/` ;
export const create_email_url = endpoint+ `create-email/` ;

export const create_comment_url = endpoint+'create-comment/' ;

export const login_url = endpoint+`login/`;
export const signup_url = endpoint+`signup/` ;

export const create_upvote_url = endpoint+`create-upvote/` ;

export const reset_password_url = endpoint+`password-reset/`;

export const set_new_password_url = `http://127.0.0.1:8000/rest-auth/password/reset/confirm/` ; 

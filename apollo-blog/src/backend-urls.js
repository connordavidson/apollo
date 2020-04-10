

//export const endpoint_without_api = `http://127.0.0.1:8000/` ;
// export const endpoint = `http://127.0.0.1:8000/api/`;
export const endpoint = `/api/`;



export const all_articles_url =     endpoint+`all-articles/` ;
export const article_url = (id) =>  endpoint+`article/`+id+`/` ;

export const create_article_url = endpoint+ `create-article/` ;
export const create_email_url = endpoint+ `create-email/` ;

export const create_comment_url = endpoint+'create-comment/' ;

export const login_url = endpoint+`login/`;
export const signup_url = endpoint+`signup/` ;


export const create_comment_upvote_url = endpoint+`create-comment-upvote/` ;
export const remove_comment_upvote_url = (upvote) => endpoint+`remove-comment-upvote/` + upvote ;
export const get_comment_upvotes_url = (comment_id) => endpoint+'comment-upvote/' + comment_id + '/';

export const create_comment_downvote_url = endpoint+`create-comment-downvote/` ;
export const remove_comment_downvote_url = (downvote) => endpoint+`remove-comment-downvote/` + downvote ;
export const get_comment_downvotes_url = (comment_id) => endpoint+'comment-downvote/' + comment_id + '/';


export const create_article_upvote_url = endpoint+`create-article-upvote/` ;
export const remove_article_upvote_url = (upvote) => endpoint+`remove-article-upvote/` + upvote ;
export const get_article_upvotes_url = (article_id) => endpoint+'article-upvote/' + article_id + '/';

export const create_article_downvote_url = endpoint+`create-article-downvote/` ;
export const remove_article_downvote_url = (downvote) => endpoint+`remove-article-downvote/` + downvote ;
export const get_article_downvotes_url = (article_id) => endpoint+'article-downvote/' + article_id + '/';

export const get_user_details_url = endpoint+`user-details/` ;
export const get_user_article_upvotes_url = (user_id) => endpoint + 'user-article-upvote/' + user_id + '/' ;
export const get_user_article_downvotes_url = (user_id) => endpoint + 'user-article-downvote/' + user_id + '/' ;
export const get_user_comment_upvotes_url = (user_id) => endpoint + 'user-comment-upvote/' + user_id + '/' ;
export const get_user_comment_downvotes_url = (user_id) => endpoint + 'user-comment-downvote/' + user_id + '/' ;


export const create_user_read_article_url = endpoint+`create-user-read-article/` ;
export const get_user_read_article_url = (user_id) => endpoint+`user-read-article/`+user_id+'/' ;


export const reset_password_url = endpoint+`password-reset/`;




export const set_new_password_url =  `http://127.0.0.1:8000/rest-auth/password/reset/confirm/` ;

export const get_user_info_url =  `http://127.0.0.1:8000/rest-auth/user/` ;

export const change_password_url =  `http://127.0.0.1:8000/password-change/` ;

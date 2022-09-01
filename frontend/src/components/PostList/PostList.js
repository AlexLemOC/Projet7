import React from "react";

// Components
import Post from "../../components/Post/Post";

// Styles
import styles from "./PostList.module.css";

const PostList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className={styles.container}>
                <h2>Pas de post pour le moment</h2>
            </div>
        );
    }

    return (
        <>
            {props.items.map((post) => {
                return (
                    <Post
                        key={post.post_id}
                        id={post.post_id}
                        user_id={post.user_id}
                        photo_url={post.photo_url}
                        firstName={post.firstName}
                        lastName={post.lastName}
                        date={post.post_date}
                        category={post.category}
                        title={post.title}
                        image_url={post.image_url}
                        likes={post.likes}
                        dislikes={post.dislikes}
                        userReaction={post.userReaction}
                        post_link={`/posts/${post.post_id}/update`}
                        onUpdate={props.onUpdatePost}
                        onDelete={props.onDeletePost}
                        onClick={`/posts/${post.post_id}`}
                    />
                );
            })}
        </>
    );
};

export default PostList;
import React, { useState } from "react";
import Comment from "../Comment";
import CommentForm from "../Forms/CommentForm";
import {
  GetTodoGetTodo,
  GroupComments,
  LoadCommentsComponent,
} from "../../../generated/apolloComponents";
import { sortDates } from "../../utils/sortDates";
import { responseIsInvalid } from "../../utils/isResponseValid";
import { LoadCommentsQuery } from "../../../graphql/todo/query/comments";

interface Props {
  todo: GetTodoGetTodo;
  removeComment: (id: string) => void;
  comments: GroupComments[];
  setTodo: React.Dispatch<React.SetStateAction<GetTodoGetTodo>>;
  setComments: React.Dispatch<React.SetStateAction<GroupComments[]>>;
}

const TodoCommentsWrapper: React.FC<Props> = ({
  todo,
  removeComment,
  comments,
  setTodo,
  setComments,
}) => {
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(todo.comments.length);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(
    comments.length < todo.commentsCount
  );
  const [showComments, setShowComments] = useState<boolean>(
    !!todo.commentsCount
  );

  return (
    <div>
      <h2 style={{ margin: 0 }}>Comments</h2>
      <div>
        <button onClick={() => setShowComments((_) => !_)}>
          ({todo.commentsCount}) Comments
        </button>

        <button onClick={() => setShowCommentForm((_) => !_)}>comment</button>
      </div>

      {showCommentForm && (
        <CommentForm
          addComment={(newComment: any) => {
            setSkip((skip) => skip + 1);

            setTodo((todo) => ({
              ...todo,
              commentsCount: todo.commentsCount + 1,
              comments: sortDates([newComment, ...todo.comments], "timeStamp"),
            }));

            setShowCommentForm(false);
            setShowComments(true);
          }}
          todo={todo}
        />
      )}

      {showComments && (
        <div
          style={{
            padding: 15,
            marginLeft: 10,
            borderLeft: "1px solid black",
          }}
        >
          {comments.map((comment: GroupComments, idx: number) => (
            <Comment
              comment={comment}
              key={idx}
              removeComment={removeComment}
            />
          ))}

          {canLoadMore && (
            <LoadCommentsComponent skip={true}>
              {({ client }) => (
                <button
                  onClick={async () => {
                    const res = await client.query({
                      query: LoadCommentsQuery,
                      variables: {
                        todoId: parseInt(todo.id),
                        skip,
                      },
                    });

                    if (responseIsInvalid(res, "comments")) return;

                    setSkip((skip) => skip + res.data.comments.length);

                    if (!res.data.comments.length) return setCanLoadMore(false);

                    setComments((comments) =>
                      sortDates(
                        [...(res.data.comments as any[]), ...comments],
                        "timeStamp"
                      )
                    );
                  }}
                >
                  load more
                </button>
              )}
            </LoadCommentsComponent>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoCommentsWrapper;

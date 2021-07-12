import dayjs from "dayjs";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import {
  CreateCommentComponent,
  DeleteCommentComponent,
  GroupComments,
  NestedCommentsComponent,
} from "../../generated/apolloComponents";
import { NestedCommentsQuery } from "../../graphql/todo/query/comments";
import { COMMENTS_LIMIT } from "../utils/constants";
import { responseIsInvalid } from "../utils/isResponseValid";
import { sortDates } from "../utils/sortDates";
import Picture from "../ui/Picture";
import { InputField } from "./inputField";

interface CommentProps {
  comment: GroupComments;
  removeComment: any;
}

const Comment: React.FC<CommentProps> = (props) => {
  const [comment, setComment] = useState<GroupComments>(props.comment);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [skipComments, setSkipComments] = useState<number>(0);
  const [nestedComments, setNestedComments] = useState<GroupComments[] | null>(
    null
  );
  const [loadingNestedComments, setLoadingNestedComments] = useState<boolean>(
    false
  );

  useEffect(() => {
    setNestedComments(null);
    setShowComments(false);
    setComment(props.comment);
  }, [props]);

  const createComment = (newComment: any) => {
    setNestedComments((nestedComments) =>
      sortDates([newComment, ...((nestedComments as any) || [])], "timeStamp")
    );

    setShowComments(true);
    setSkipComments((skipComments) => (skipComments += 1));

    setComment((comment) => ({
      ...comment,
      commentsCount: comment.commentsCount + 1,
    }));
  };

  const removeComment = (id: string) => {
    setComment((comment) => ({
      ...comment,
      commentsCount: comment.commentsCount - 1,
    }));

    setNestedComments((comments) => (comments || []).filter((_) => _.id != id));
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        {comment.author.pictureUrl && (
          <Picture src={comment.author.pictureUrl} />
        )}
        <p>{comment.author.name}</p>
        <p>{comment.author.email}</p>
        <p>{dayjs(comment.timeStamp).format("MMMM D, YYYY h:mm A")}</p>
        <DeleteCommentComponent variables={{ commentId: Number(comment.id) }}>
          {(deleteComment) => (
            <button
              style={{ height: "30px" }}
              onClick={async () => {
                const res = await deleteComment();
                if (!res || !res.data || !res.data.deleteComment) return;

                props.removeComment(comment.id);
              }}
            >
              delete
            </button>
          )}
        </DeleteCommentComponent>
      </div>
      <div
        style={{
          marginBottom: 10,
          padding: 15,
          marginLeft: 10,
          borderLeft: "1px solid black",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <span>{comment.text}</span>
        </div>

        <NestedCommentsComponent
          skip={true}
          variables={{ parentId: Number(comment.id), skip: 0 }}
        >
          {(comments) => (
            <div>
              <button
                onClick={async () => {
                  setShowComments((showcomments) => !showcomments);

                  if (!nestedComments && comment.commentsCount) {
                    setLoadingComments(true);

                    const res = await comments.client.query({
                      query: NestedCommentsQuery,
                      variables: { parentId: Number(comment.id), skip: 0 },
                    });
                    setLoadingComments(false);

                    if (responseIsInvalid(res, "nestedComments")) return;

                    setSkipComments(
                      (skipComments) => (skipComments += COMMENTS_LIMIT)
                    );
                    setNestedComments((nestedComments) =>
                      sortDates(
                        [
                          ...(res.data.nestedComments as any),
                          ...((nestedComments as any) || []),
                        ],
                        "timeStamp"
                      )
                    );
                  }
                }}
              >
                ({comment.commentsCount}) Comments
              </button>

              <button
                onClick={() =>
                  setShowCommentForm((showCommentForm) => !showCommentForm)
                }
              >
                Comment
              </button>

              {showCommentForm && (
                <NestedCommentForm
                  todoId={comment.todoId}
                  parentCommentId={parseInt(comment.id)}
                  newComment={createComment}
                />
              )}

              {loadingComments && <p>Loading...</p>}

              {showComments && nestedComments && (
                <div>
                  {nestedComments.map((_: GroupComments, idx: number) => (
                    <div key={idx}>
                      <Comment removeComment={removeComment} comment={_} />
                    </div>
                  ))}

                  {!!comment.commentsCount &&
                    comment.commentsCount > nestedComments.length && (
                      <div style={{ display: "flex" }}>
                        <button
                          onClick={async () => {
                            setLoadingNestedComments(true);
                            const res = await comments.client.query({
                              query: NestedCommentsQuery,
                              variables: {
                                parentId: Number(comment.id),
                                skip: skipComments,
                              },
                            });
                            setLoadingNestedComments(false);

                            if (responseIsInvalid(res, "nestedComments"))
                              return;

                            setSkipComments(
                              (skipComments) => (skipComments += COMMENTS_LIMIT)
                            );

                            setNestedComments((nestedComments) =>
                              sortDates(
                                [
                                  ...res.data.nestedComments,
                                  ...(nestedComments || []),
                                ],
                                "timeStamp"
                              )
                            );
                          }}
                        >
                          load more
                        </button>
                        {loadingNestedComments && <p>Loading....</p>}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </NestedCommentsComponent>
      </div>
    </div>
  );
};

interface NestedCommentFormProps {
  todoId: number;
  parentCommentId: number;
  newComment: (newComments: any) => void;
}

const NestedCommentForm: React.FC<NestedCommentFormProps> = ({
  todoId,
  parentCommentId,
  newComment,
}) => (
  <div style={{ marginLeft: 25 }}>
    <CreateCommentComponent>
      {(createComment) => (
        <Formik
          validateOnBlur={false}
          enableReinitialize={true}
          validateOnChange={false}
          onSubmit={async (data) => {
            const res = await createComment({
              variables: {
                data: { todoId, text: data.text, parentCommentId },
              },
            });

            if (!res || !res.data || !res.data.createComment) return;

            newComment(res.data.createComment);
          }}
          initialValues={{
            text: "",
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field name="text" placeholder="text" component={InputField} />
              <button type="submit">create comment</button>
            </form>
          )}
        </Formik>
      )}
    </CreateCommentComponent>
  </div>
);

export default Comment;

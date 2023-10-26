'use client'
import { useRouter,usePathname } from 'next/navigation';
import { PostProps, CommentProps } from './Post';
import styles from '../styles/Post.module.css'
import ReactMarkdown from 'react-markdown'
import { useState } from "react"
import path from 'path';

export default function PostDetails({ title, author, content, published, id, comments }: PostProps) {
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [commentUserEmail, setCommentUserEmail] = useState('')
  const [error, setError] = useState('')
  const pathname = usePathname()
  
  async function publish(id: number) {
    await fetch(`/api/publish/${id}`, {
      method: 'PUT',
    })
    router.push('/')
  }

  async function destroy(id: number) {
    await fetch(`/api/post/${id}`, {
      method: 'DELETE',
    })
    router.push('/')
  }

  async function deleteComment(id: number) {
    await fetch(`/api/comment/${id}`, {
      method: 'DELETE',
    })
    // refresh the page
    if(pathname){
      router.refresh()
    }
  }

  async function addCommentToPost() {
    setError('')
    const response = await fetch(`/api/comment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({comment, commentUserEmail, id}),
    })

    const json = await response.json()
    if (!response.ok) {
      setError( json.message )
    }
    // refresh the page
    if(pathname){
      setComment('')
      setCommentUserEmail('')
      router.refresh()
    }
  }
  
  if (!published) {
    title = `${title} (Draft)`
  }


  return (
    <div>
      <h2>{title}</h2>
      <p>By {author?.name || 'Unknown author'}</p>
      {/* @ts-ignore */}
      <ReactMarkdown>{content}</ReactMarkdown>
      {!published && (
        <button
          className={styles.button} onClick={() => publish(id)}>
          Publish
        </button>
      )}
      <button className={styles.button} onClick={() => destroy(id)}>
        Delete
      </button>

      <h2>
        Comments
      </h2>
      <input type="text" className={styles.custom__input} value={comment} onChange={(e)=> setComment(e.target.value)} placeholder="Comment"/>
      <input type="text" className={styles.custom__input} value={commentUserEmail} onChange={(e)=> setCommentUserEmail(e.target.value)} placeholder="Enter Your Email"/>
      <button className={styles.button} disabled={!comment || !commentUserEmail}  onClick={addCommentToPost}>Add Comment</button>
      <p className={styles.error}>{error}</p>
      {
        comments.map((comment: CommentProps) => (
          <div key={comment.id} className={styles.comment__container}>
            <div>
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" alt="" />
                          </div>
                          <div>
                            <h3>{comment.content}</h3>
                            <p>{comment.author?.name}</p>
                            <small>{new Date(comment.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</small>
                          </div>
                          <div className={styles.btn__container}>
                            <button className={styles.button} onClick={ ()=> deleteComment(comment.id) }>Delete</button>
                          </div>
                        </div>
                      ))
                    }
                  </div>

                )
              }

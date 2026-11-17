import { CancelPostButton } from "./CancelPostButton";
import { CreatePostButton } from "./CreatePostButton";
import styles from "./Posts.module.css";

interface PostFormButtonsProps {
  enviando: boolean;
  onCancel: () => void;
}

export const PostFormButtons = ({ enviando, onCancel }: PostFormButtonsProps) => {
  return (
    <div className={styles.acciones}>
      <CancelPostButton enviando={enviando} onCancel={onCancel} />
      
      <CreatePostButton enviando={enviando} />
    </div>
  );
};

export default PostFormButtons;
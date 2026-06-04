import feedbackStyles from "../../styles/feedback.module.css";

function FeedbackMessage({ message, type = "error" }) {
  const textClass = feedbackStyles[`${type}Text`] ?? feedbackStyles.loadingText;

  return (
    <section className={feedbackStyles.card}>
      <p className={feedbackStyles[textClass]}>{message}</p>
    </section>
  );
}
export default FeedbackMessage;

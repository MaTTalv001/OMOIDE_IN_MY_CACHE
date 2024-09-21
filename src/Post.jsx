import React from 'react';

const Post = ({ correctAnswers, mode }) => {
  const handleTweet = () => {
    const modeName = mode === 'easy' ? 'イージー' : mode === 'normal' ? 'ノーマル' : 'ハード';
    
    let resultMessage = '';
    if (correctAnswers === 10) {
      resultMessage = '流行語マスター爆誕！🎉';
    } else if (correctAnswers >= 7) {
      resultMessage = 'なかなかやるねぇ！👍';
    } else if (correctAnswers >= 4) {
      resultMessage = 'まあまあだね、がんばった！😊';
    } else if (correctAnswers >= 1) {
      resultMessage = 'ニュースチェックしてみる？📰';
    } else {
      resultMessage = '世間から浮いてるぅ〜😅';
    }

    const tweetText = `流行語新旧当てクイズ（${modeName}モード）で${correctAnswers}問正解しました！${resultMessage} #RUNTEQ #ミニアプリWeek`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      'https://omoide-in-my-brain.vercel.app/'
    )}&text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <button className="btn btn-primary" onClick={handleTweet}>
      結果をポスト
    </button>
  );
};

export default Post;
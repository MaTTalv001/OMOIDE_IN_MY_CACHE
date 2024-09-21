import React, { useState, useEffect } from "react";
import "./App.css";
import Tweet from "./Post"; 

function App() {
  const [data, setData] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [selectedInequality, setSelectedInequality] = useState(null);
  const [result, setResult] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [mode, setMode] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // データをロード
  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // クイズをスタート
  const startQuiz = (selectedMode) => {
    setMode(selectedMode);
    const filtered = filterDataByMode(selectedMode);
    setFilteredData(filtered);
    setQuestionNumber(1);
    setTotalCorrect(0);
    setQuiz(generateQuiz(filtered));
    setSelectedInequality(null);
    setResult(null);
    setShowModal(false);
  };

  // モードに応じてデータをフィルタリング
  const filterDataByMode = (selectedMode) => {
    return data.filter(item => {
      switch(selectedMode) {
        case 'easy':
          return item.年度 >= 2010;
        case 'normal':
          return item.年度 >= 2000;
        case 'hard':
          return item.年度 >= 1990;
        default:
          return true;
      }
    });
  };

  // クイズを生成
  const generateQuiz = (dataToUse) => {
    const randomIndexes = getRandomIndexes(dataToUse);
    return {
      option1: dataToUse[randomIndexes[0]],
      option2: dataToUse[randomIndexes[1]],
    };
  };

  // 2つのランダムなインデックスを取得（年度が異なるように）
  const getRandomIndexes = (dataToUse) => {
    let index1 = Math.floor(Math.random() * dataToUse.length);
    let index2 = Math.floor(Math.random() * dataToUse.length);
    while (
      index1 === index2 ||
      dataToUse[index1].年度 === dataToUse[index2].年度
    ) {
      index2 = Math.floor(Math.random() * dataToUse.length);
    }
    return [index1, index2];
  };

  // 回答のチェック
  const checkAnswer = () => {
    if (!quiz || !selectedInequality) return;

    const year1 = quiz.option1.年度;
    const year2 = quiz.option2.年度;

    let isCorrect = false;

    if (selectedInequality === '>') {
      isCorrect = year1 > year2;
    } else if (selectedInequality === '<') {
      isCorrect = year1 < year2;
    }

    if (isCorrect) {
      setTotalCorrect(totalCorrect + 1);
      setResult("💡💡💡💡正解！💡💡💡💡");
    } else {
      setResult("😈😈😈不正解！😈😈😈");
    }
    setShowModal(true);
  };

  // 次の問題へ
  const nextQuestion = () => {
    setQuestionNumber(questionNumber + 1);
    setQuiz(generateQuiz(filteredData));
    setSelectedInequality(null);
    setResult(null);
    setShowModal(false);
  };

  // クイズ終了
  const finishQuiz = () => {
    setShowModal(false);
    setResultModal(true);
  };

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {!quiz && (
          <div className="text-center">
            <img src="/omoide.jpg" alt="思い出クイズ" className="mx-auto mb-4 max-w-sm" />
            <h1 className="text-3xl font-bold mb-4">OMOIDE IN MY CACHE</h1>
            <h3 className="text-xl font-bold mb-4">流行語を思い出す</h3>
            <p className="mb-4 text-left max-w-2xl mx-auto">
              過去の流行語を比較して、どちらが新しいかを当てるクイズです。
              2つの流行語が表示されるので、より新しいと思う方を選んでください。
              10問連続で出題され、最後に正解数が表示されます。
            </p>
            <div className="mt-4 flex justify-center">
              <div className="mx-2 text-center">
                <button className="btn btn-primary mb-2" onClick={() => startQuiz('easy')}>
                  イージーモード
                </button>
                <p className="text-sm">
                  2010年以降
                </p>
              </div>
              <div className="mx-2 text-center">
                <button className="btn btn-secondary mb-2" onClick={() => startQuiz('normal')}>
                  ノーマルモード
                </button>
                <p className="text-sm">
                  2000年以降
                </p>
              </div>
              <div className="mx-2 text-center">
                <button className="btn btn-accent mb-2" onClick={() => startQuiz('hard')}>
                  ハードモード
                </button>
                <p className="text-sm">
                  1990年以降
                </p>
              </div>
            </div>
          </div>
        )}
  
        {quiz && (
          <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-2xl">第{questionNumber}問</h2>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="w-2/5 text-center">
              <img 
                src={quiz.option1.画像} 
                alt={quiz.option1.流行語} 
                className="w-full max-h-40 object-contain mb-2" 
              />
                <p className="text-xl">{quiz.option1.流行語}</p>
              </div>
              <div className="w-1/5">
                <select
                  className="select select-bordered w-full"
                  value={selectedInequality || ''}
                  onChange={(e) => setSelectedInequality(e.target.value)}
                >
                  <option value="" disabled>選択</option>
                  <option value=">">＞ (左が新しい)</option>
                  <option value="<">＜ (右が新しい)</option>
                </select>
              </div>
              <div className="w-2/5 text-center">
              <img 
                src={quiz.option2.画像} 
                alt={quiz.option2.流行語} 
                className="w-full max-h-40 object-contain mb-2" 
              />
                <p className="text-xl">{quiz.option2.流行語}</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <button 
                className="btn btn-secondary" 
                onClick={checkAnswer}
                disabled={!selectedInequality}
              >
                回答
              </button>
            </div>
            <div className="text-center mt-20">
              <button 
                className="btn btn-outline btn-sm mt-10" 
                onClick={() => window.location.reload()}
              >
                トップに戻る
              </button>
            </div>
          </div>
        )}
      </div>
  
      {/* 回答結果のモーダル */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg text-center mb-4">{result}</h3>
            <div className="flex justify-between">
              <div className="w-1/2 pr-4 text-left">
                <div className="h-40 flex items-center justify-center mb-2">
                  <img 
                    src={quiz.option1.画像} 
                    alt={quiz.option1.流行語} 
                    className="max-w-full max-h-40 object-contain" 
                  />
                </div>
                <h4 className="font-semibold">{quiz.option1.流行語}</h4>
                <p>年度: {quiz.option1.年度}</p>
                <p>受賞者: {quiz.option1.受賞者}</p>
                <p>解説: {quiz.option1.解説}</p>
              </div>
              <div className="w-1/2 pl-4 text-left">
              <div className="h-40 flex items-center justify-center mb-2">
                <img 
                  src={quiz.option2.画像} 
                  alt={quiz.option2.流行語} 
                  className="max-w-full max-h-40 object-contain" 
                />
              </div>
                <h4 className="font-semibold">{quiz.option2.流行語}</h4>
                <p>年度: {quiz.option2.年度}</p>
                <p>受賞者: {quiz.option2.受賞者}</p>
                <p>解説: {quiz.option2.解説}</p>
              </div>
            </div>
            <div className="modal-action">
              {questionNumber < 10 ? (
                <button className="btn" onClick={nextQuestion}>
                  次の問題へ
                </button>
              ) : (
                <button className="btn" onClick={finishQuiz}>
                  結果を見る
                </button>
              )}
            </div>
          </div>
        </div>
      )}
  
      {/* 最終結果のモーダル */}
      {resultModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">ゲーム終了！</h3>
            <p className="py-4">
              あなたは {totalCorrect} / 10 問正解しました！
            </p>
            {(() => {
              let resultMessage = '';
              if (totalCorrect === 10) {
                resultMessage = '流行語マスター爆誕！🎉 素晴らしい成績です！';
              } else if (totalCorrect >= 7) {
                resultMessage = 'なかなかやるねぇ！👍 流行に敏感な様子。';
              } else if (totalCorrect >= 4) {
                resultMessage = 'まあまあだね、がんばった！😊 もう少しで流行通！';
              } else if (totalCorrect >= 1) {
                resultMessage = 'ニュースチェックしてみる？📰 流行をキャッチアップしよう！';
              } else {
                resultMessage = '世間から浮いてるぅ〜😅 でも気にしない！あなたは特別だ！';
              }
              return <p className="py-2 text-sm">{resultMessage}</p>;
            })()}
            <div className="modal-action">
              <Tweet correctAnswers={totalCorrect} mode={mode} />
              <button
                className="btn"
                onClick={() => {
                  setResultModal(false);
                  setQuiz(null);
                  setQuestionNumber(0);
                  setTotalCorrect(0);
                  setMode(null);
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
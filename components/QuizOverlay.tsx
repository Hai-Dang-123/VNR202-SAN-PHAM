
import React, { useState } from 'react';

interface QuizOverlayProps {
    onClose: () => void;
    onAnswer: (isCorrect: boolean) => void;
}

const questions = [
    {
        question: "What year did Vietnam initiate the 'Đổi Mới' (Renovation) policy?",
        options: ["1975", "1986", "1991", "2000"],
        answer: "1986"
    },
    {
        question: "Vietnam's foreign policy shifted towards being a 'friend and reliable partner' to the international community. This was strongly emphasized after:",
        options: ["Joining the UN in 1977", "The 11th National Congress in 2011", "Normalizing relations with the U.S. in 1995", "Hosting APEC in 2006"],
        answer: "The 11th National Congress in 2011"
    },
    {
        question: "Which of these organizations did Vietnam join in 1995, marking a major step in regional integration?",
        options: ["WTO", "United Nations", "ASEAN", "APEC"],
        answer: "ASEAN"
    }
];

const QuizOverlay: React.FC<QuizOverlayProps> = ({ onClose, onAnswer }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    const handleAnswerClick = (option: string) => {
        if (feedback) return; // Prevent answering multiple times

        const isCorrect = option === questions[currentQuestionIndex].answer;
        onAnswer(isCorrect);
        if (isCorrect) {
            setFeedback("Correct!");
            setScore(prev => prev + 1);
        } else {
            setFeedback("Try again!");
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setQuizFinished(true);
            }
        }, 1500);
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg p-8 m-4 max-w-lg w-full text-center shadow-2xl animate-fade-in">
                {!quizFinished ? (
                    <>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Question {currentQuestionIndex + 1}</h2>
                        <p className="text-lg mb-6 text-gray-600">{questions[currentQuestionIndex].question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {questions[currentQuestionIndex].options.map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerClick(option)}
                                    disabled={!!feedback}
                                    className="p-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {feedback && (
                            <p className={`mt-6 text-2xl font-bold ${feedback === 'Correct!' ? 'text-green-500' : 'text-red-500'}`}>
                                {feedback}
                            </p>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
                        <p className="text-xl mb-6 text-gray-600">You scored {score} out of {questions.length}</p>
                        <button
                            onClick={onClose}
                            className="w-full p-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            Back to Book
                        </button>
                    </>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default QuizOverlay;

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, PlayCircle, FileText, CheckCircle, Clock, Upload, Loader2, Download, Plus, Trash2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";

export default function CoursePage() {
  const params = useParams();
  const [course, setCourse] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Quiz State
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isTakeQuizOpen, setIsTakeQuizOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  
  // Quiz Creation Form
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({ type: "mcq", question: "", options: ["", "", "", ""], answer: 0 });

  // Quiz Taking State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = () => {
    fetch("/api/courses")
        .then(res => res.json())
        .then(courses => {
            const found = courses.find((c: any) => c.id === params.id);
            setCourse(found);
        });
  };

  const handleMaterialUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
        const res = await fetch(`/api/courses/${params.id}/materials`, { method: "POST", body: formData });
        if (res.ok) { fetchData(); setIsUploadOpen(false); }
    } finally { setUploading(false); }
  };

  // --- Quiz Creation Logic ---
  const addQuestion = () => {
      setQuestions([...questions, { ...currentQuestion }]);
      setCurrentQuestion({ type: "mcq", question: "", options: ["", "", "", ""], answer: 0 });
  };

  const saveQuiz = async () => {
      if (!quizTitle || questions.length === 0) return;
      await fetch(`/api/courses/${params.id}/quizzes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: quizTitle, questions })
      });
      setIsCreateQuizOpen(false);
      setQuizTitle("");
      setQuestions([]);
      fetchData();
  };

  // --- Quiz Taking Logic ---
  const startQuiz = (quiz: any) => {
      setActiveQuiz(quiz);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setIsTakeQuizOpen(true);
  };

  const handleAnswer = () => {
      const question = activeQuiz.questions[currentQuestionIndex];
      // Check if answer is correct (index match for MCQ, boolean match for T/F)
      if (currentQuestionIndex === activeQuiz.questions.length - 1) {
          // Finish
          let finalScore = score;
          if (selectedAnswer === question.answer) finalScore += 1;
          setScore(finalScore);
          setShowResult(true);
          
          // Save Score
          fetch(`/api/courses/${params.id}/quizzes`, {
              method: "PATCH",
              body: JSON.stringify({ quizId: activeQuiz.id, score: Math.round((finalScore / activeQuiz.questions.length) * 100) })
          }).then(fetchData);

      } else {
          // Next
          if (selectedAnswer === question.answer) setScore(score + 1);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
      }
  };

  if (!course) return <div className="p-8 text-center text-rose-500">Loading course...</div>;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
       <div className="space-y-2">
            <Link href="/" className="inline-flex items-center text-sm text-rose-600 hover:text-rose-800 dark:text-pink-400 dark:hover:text-pink-300 transition-colors font-medium">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-rose-950 dark:text-pink-100">{course.title}</h1>
            <p className="text-rose-600 dark:text-pink-400 font-medium">{course.code} • {course.instructor}</p>
       </div>

       <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
                {/* QUIZZES SECTION */}
                <Card className="border-pink-200 dark:border-pink-900 bg-white/90 dark:bg-card/90 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-pink-100 dark:border-pink-900/50">
                        <CardTitle className="text-rose-900 dark:text-pink-100">Quizzes</CardTitle>
                        <Dialog open={isCreateQuizOpen} onOpenChange={setIsCreateQuizOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white border-none">
                                    <Plus className="h-4 w-4 mr-2" /> Create Quiz
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader><DialogTitle>Create New Quiz</DialogTitle></DialogHeader>
                                <div className="space-y-4 py-4">
                                    <input className="w-full p-2 border rounded bg-background" placeholder="Quiz Title" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} />
                                    
                                    <div className="p-4 border rounded-lg bg-pink-50/50 dark:bg-pink-900/20 space-y-3">
                                        <h4 className="font-semibold text-sm">Add Question {questions.length + 1}</h4>
                                        <select 
                                            className="w-full p-2 border rounded bg-background" 
                                            value={currentQuestion.type} 
                                            onChange={e => setCurrentQuestion({...currentQuestion, type: e.target.value})}
                                        >
                                            <option value="mcq">Multiple Choice</option>
                                            <option value="tf">True/False</option>
                                        </select>
                                        <input 
                                            className="w-full p-2 border rounded bg-background" 
                                            placeholder="Question Text" 
                                            value={currentQuestion.question} 
                                            onChange={e => setCurrentQuestion({...currentQuestion, question: e.target.value})} 
                                        />
                                        
                                        {currentQuestion.type === 'mcq' && (
                                            <div className="space-y-2">
                                                {currentQuestion.options.map((opt, i) => (
                                                    <div key={i} className="flex gap-2 items-center">
                                                        <input 
                                                            type="radio" 
                                                            name="correct" 
                                                            checked={currentQuestion.answer === i} 
                                                            onChange={() => setCurrentQuestion({...currentQuestion, answer: i})} 
                                                        />
                                                        <input 
                                                            className="flex-1 p-1 border rounded text-sm bg-background" 
                                                            placeholder={`Option ${i+1}`} 
                                                            value={opt} 
                                                            onChange={e => {
                                                                const newOpts = [...currentQuestion.options];
                                                                newOpts[i] = e.target.value;
                                                                setCurrentQuestion({...currentQuestion, options: newOpts});
                                                            }} 
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {currentQuestion.type === 'tf' && (
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" name="tf" checked={currentQuestion.answer === 0} onChange={() => setCurrentQuestion({...currentQuestion, answer: 0})} /> True
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" name="tf" checked={currentQuestion.answer === 1} onChange={() => setCurrentQuestion({...currentQuestion, answer: 1})} /> False
                                                </label>
                                            </div>
                                        )}

                                        <Button variant="secondary" onClick={addQuestion} className="w-full mt-2">Add Question</Button>
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        Questions added: {questions.length}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={saveQuiz} disabled={!quizTitle || questions.length === 0}>Save Quiz</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        {course.quizzes && course.quizzes.length > 0 ? course.quizzes.map((quiz: any) => (
                            <div key={quiz.id} className="flex items-center justify-between p-4 rounded-xl border border-pink-100 dark:border-pink-900/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors bg-white dark:bg-card">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                        <HelpCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-rose-900 dark:text-pink-100">{quiz.title}</h4>
                                        <p className="text-xs text-rose-400 dark:text-pink-400">{quiz.questions.length} Questions • Last Score: {quiz.lastScore ? `${quiz.lastScore}%` : 'Not taken'}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="text-rose-600 dark:text-pink-300 border-rose-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/30" onClick={() => startQuiz(quiz)}>
                                    {quiz.lastScore ? "Retake" : "Start"}
                                </Button>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-rose-400 dark:text-pink-500">No quizzes yet. Create one!</div>
                        )}
                    </CardContent>
                </Card>

                {/* MATERIALS SECTION */}
                <Card className="border-pink-200 dark:border-pink-900 bg-white/90 dark:bg-card/90 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-pink-100 dark:border-pink-900/50">
                        <CardTitle className="text-rose-900 dark:text-pink-100">Course Materials</CardTitle>
                        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-rose-600 dark:text-pink-300 border-rose-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/30">
                                    <Upload className="h-4 w-4 mr-2" /> Add Material
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Upload Material</DialogTitle></DialogHeader>
                                <div className="py-4">
                                    <div className="border-2 border-dashed border-pink-200 dark:border-pink-800 rounded-lg p-8 text-center bg-pink-50/50 dark:bg-pink-900/10 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors cursor-pointer relative">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMaterialUpload} disabled={uploading} />
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            {uploading ? <Loader2 className="h-8 w-8 text-rose-500 animate-spin" /> : <Upload className="h-8 w-8 text-rose-400" />}
                                            <p className="text-sm font-medium text-rose-600 dark:text-pink-300">{uploading ? "Uploading..." : "Click to select file"}</p>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        {course.materials && course.materials.length > 0 ? course.materials.map((material: any) => (
                            <div key={material.id} className="flex items-center justify-between p-4 rounded-xl border border-pink-100 dark:border-pink-900/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors group bg-white dark:bg-card">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className={cn("p-2 rounded-lg shrink-0", material.type === 'pdf' ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400")}>
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="truncate">
                                        <h4 className="font-bold text-rose-900 dark:text-pink-100 truncate group-hover:text-rose-700 dark:group-hover:text-pink-300 transition-colors">{material.title}</h4>
                                        <p className="text-xs text-rose-400 dark:text-pink-400">{new Date(material.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <a href={material.url} download>
                                    <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-600 dark:text-pink-400 dark:hover:text-pink-200">
                                        <Download className="h-4 w-4 mr-2" />
                                    </Button>
                                </a>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-rose-400 dark:text-pink-500">No materials uploaded yet.</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="bg-gradient-to-br from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-800 text-white border-none shadow-md">
                    <CardHeader><CardTitle className="text-lg text-white">Your Progress</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black mb-2">{course.progress}%</div>
                        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <p className="text-xs mt-2 opacity-90 font-medium">Keep it up! You're doing great. 🌟</p>
                    </CardContent>
                </Card>

                <Card className="border-pink-200 dark:border-pink-900 bg-white/90 dark:bg-card/90 backdrop-blur-sm">
                     <CardHeader className="pb-2"><CardTitle className="text-lg text-rose-900 dark:text-pink-100">Class Info</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-900/50">
                            <Clock className="h-5 w-5 text-rose-500 dark:text-pink-400" />
                            <div>
                                <p className="text-xs font-bold text-rose-400 dark:text-pink-500 uppercase">Schedule</p>
                                <p className="text-sm font-medium text-rose-900 dark:text-pink-100">{course.schedule}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-900/50">
                            <div className="h-5 w-5 rounded-full border-2 border-rose-500 dark:border-pink-400 flex items-center justify-center text-[10px] font-bold text-rose-500 dark:text-pink-400">R</div>
                            <div>
                                <p className="text-xs font-bold text-rose-400 dark:text-pink-500 uppercase">Room</p>
                                <p className="text-sm font-medium text-rose-900 dark:text-pink-100">{course.room}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-900/50">
                            <CheckCircle className="h-5 w-5 text-rose-500 dark:text-pink-400" />
                            <div>
                                <p className="text-xs font-bold text-rose-400 dark:text-pink-500 uppercase">Units</p>
                                <p className="text-sm font-medium text-rose-900 dark:text-pink-100">{course.units}.0</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
       </div>

       {/* TAKE QUIZ DIALOG */}
       <Dialog open={isTakeQuizOpen} onOpenChange={setIsTakeQuizOpen}>
           <DialogContent className="max-w-2xl bg-white dark:bg-card border-pink-200 dark:border-pink-900">
               {showResult ? (
                   <div className="text-center py-8 space-y-4">
                       <h2 className="text-2xl font-bold text-rose-900 dark:text-pink-100">Quiz Completed!</h2>
                       <div className="text-6xl font-black text-rose-500 dark:text-pink-400">{score} / {activeQuiz?.questions.length}</div>
                       <p className="text-rose-600 dark:text-pink-300">Great effort! Keep studying.</p>
                       <Button onClick={() => setIsTakeQuizOpen(false)} className="bg-rose-500 hover:bg-rose-600 text-white">Close</Button>
                   </div>
               ) : activeQuiz && (
                   <>
                       <DialogHeader>
                           <DialogTitle className="text-rose-950 dark:text-pink-100">{activeQuiz.title}</DialogTitle>
                           <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</p>
                       </DialogHeader>
                       <div className="py-4 space-y-4">
                           <h3 className="text-lg font-medium text-rose-950 dark:text-pink-100">{activeQuiz.questions[currentQuestionIndex].question}</h3>
                           <div className="space-y-2">
                               {activeQuiz.questions[currentQuestionIndex].type === 'mcq' ? (
                                   activeQuiz.questions[currentQuestionIndex].options.map((opt: string, i: number) => (
                                       <button 
                                           key={i}
                                           onClick={() => setSelectedAnswer(i)}
                                           className={cn(
                                               "w-full text-left p-3 rounded-lg border transition-all dark:text-pink-100",
                                               selectedAnswer === i 
                                                ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-900 dark:border-rose-400" 
                                                : "border-gray-200 dark:border-pink-900/50 hover:bg-gray-50 dark:hover:bg-pink-900/20"
                                           )}
                                       >
                                           {opt}
                                       </button>
                                   ))
                               ) : (
                                   <div className="flex gap-4">
                                       <button onClick={() => setSelectedAnswer(0)} className={cn("flex-1 p-4 border rounded-lg dark:text-pink-100", selectedAnswer === 0 ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30" : "dark:border-pink-900/50")}>True</button>
                                       <button onClick={() => setSelectedAnswer(1)} className={cn("flex-1 p-4 border rounded-lg dark:text-pink-100", selectedAnswer === 1 ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30" : "dark:border-pink-900/50")}>False</button>
                                   </div>
                               )}
                           </div>
                       </div>
                       <DialogFooter>
                           <Button onClick={handleAnswer} disabled={selectedAnswer === null} className="bg-rose-500 hover:bg-rose-600 text-white">
                               {currentQuestionIndex === activeQuiz.questions.length - 1 ? "Finish" : "Next Question"}
                           </Button>
                       </DialogFooter>
                   </>
               )}
           </DialogContent>
       </Dialog>
    </div>
  );
}

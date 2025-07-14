import { useState, useEffect } from 'react';
import { Volume2, Eye, BarChart3, Settings, Star, Trophy, Clock, Target, ArrowRight, CheckCircle, Circle, Lock, Unlock, User, CreditCard, LogOut, Plus, Edit2 } from 'lucide-react';

const LogicRootMultiplication = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  
  // Subscription state
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [trialEndsAt, setTrialEndsAt] = useState(null);
  
  // Form state - FIX: Use separate state objects to prevent re-rendering issues
  const [authFormData, setAuthFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  
  // Child profiles
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showChildForm, setShowChildForm] = useState(false);
  const [childFormData, setChildFormData] = useState({ name: '', age: '' });
  const [isAddingChild, setIsAddingChild] = useState(false); // FIX: Add loading state
  
  // Core game state
  const [currentView, setCurrentView] = useState('landing');
  const [currentTier, setCurrentTier] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showProblem, setShowProblem] = useState(false);
  
  // Progress tracking
  const [masteredFacts, setMasteredFacts] = useState({});
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  
  // Learning tiers
  const tiers = [
    { name: 'Identity Facts', facts: ['1×1', '1×2', '1×3', '1×4', '1×5', '1×6', '1×7', '1×8', '1×9', '1×10'], icon: '🌱' },
    { name: 'Doubles', facts: ['2×2', '2×3', '2×4', '2×5', '2×6', '2×7', '2×8', '2×9'], icon: '👥' },
    { name: 'Counting by 5s', facts: ['5×5', '5×6', '5×7', '5×8', '5×9'], icon: '🖐️' },
    { name: 'Easy Patterns', facts: ['11×11', '11×2', '11×3', '11×4', '11×5'], icon: '🔢' },
    { name: 'Tricky Threes', facts: ['3×3', '3×4', '3×6', '3×7', '3×8'], icon: '🎯' },
    { name: 'Fantastic Fours', facts: ['4×4', '4×6', '4×7', '4×8', '4×9'], icon: '🎪' },
    { name: 'Challenging Mix', facts: ['6×6', '6×7', '6×8', '7×7', '7×8', '8×8'], icon: '🚀' }
  ];
  
  // FIX: Improved input handlers that don't cause re-renders
  const handleAuthInputChange = (field, value) => {
    setAuthFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChildInputChange = (field, value) => {
    setChildFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Authentication functions
  const signUp = async (email, password, name) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({ id: '1', email, name, createdAt: new Date() });
      setIsAuthenticated(true);
      setSubscriptionStatus('trial');
      setTrialEndsAt(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setAuthView('onboarding');
      setIsLoading(false);
    }, 1000);
  };
  
  const signIn = async (email, password) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({ id: '1', email, name: 'Parent User' });
      setIsAuthenticated(true);
      
      if (email === 'trial@example.com') {
        setSubscriptionStatus('trial');
        setTrialEndsAt(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
      } else {
        setSubscriptionStatus('active');
      }
      
      setCurrentView('dashboard');
      setIsLoading(false);
    }, 1000);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSubscriptionStatus('none');
    setChildren([]);
    setSelectedChild(null);
    setCurrentView('landing');
    // FIX: Reset all form data on logout
    setAuthFormData({ email: '', password: '', confirmPassword: '', name: '' });
    setChildFormData({ name: '', age: '' });
    setAuthView('signin');
  };
  
  // FIX: Improved addChild function with proper state management
  const addChild = async () => {
    if (childFormData.name && childFormData.age) {
      setIsAddingChild(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const newChild = {
          id: Date.now().toString(),
          name: childFormData.name,
          age: parseInt(childFormData.age),
          progress: {},
          createdAt: new Date()
        };
        setChildren(prev => [...prev, newChild]);
        setChildFormData({ name: '', age: '' });
        setShowChildForm(false);
        setIsAddingChild(false);
      }, 500);
    }
  };

  // FIX: Add function to handle onboarding completion
  const completeOnboarding = async () => {
    if (childFormData.name && childFormData.age) {
      setIsAddingChild(true);
      
      setTimeout(() => {
        const newChild = {
          id: Date.now().toString(),
          name: childFormData.name,
          age: parseInt(childFormData.age),
          progress: {},
          createdAt: new Date()
        };
        setChildren(prev => [...prev, newChild]);
        setChildFormData({ name: '', age: '' });
        setAuthView(''); // FIX: Clear onboarding view
        setCurrentView('dashboard'); // FIX: Navigate to dashboard
        setIsAddingChild(false);
      }, 500);
    }
  };
  
  const selectChild = (child) => {
    setSelectedChild(child);
    setCurrentView('game');
  };
  
  // Game logic
  const generateChoices = (correct) => {
    const wrongAnswers = [];
    const commonErrors = [correct + 1, correct - 1, correct + 10, correct - 10];
    
    commonErrors.forEach(answer => {
      if (answer > 0 && answer !== correct && wrongAnswers.length < 2) {
        wrongAnswers.push(answer);
      }
    });
    
    while (wrongAnswers.length < 2) {
      const random = Math.floor(Math.random() * 50) + 1;
      if (random !== correct && !wrongAnswers.includes(random)) {
        wrongAnswers.push(random);
      }
    }
    
    return [correct, ...wrongAnswers.slice(0, 2)].sort(() => Math.random() - 0.5);
  };
  
  const parseFact = (factString) => {
    const [num1, num2] = factString.split('×').map(Number);
    return { num1, num2, answer: num1 * num2 };
  };
  
  const generateProblem = () => {
    const currentTierFacts = tiers[currentTier].facts;
    const selectedFact = currentTierFacts[Math.floor(Math.random() * currentTierFacts.length)];
    const problem = parseFact(selectedFact);
    
    setCurrentProblem({ ...problem, factString: selectedFact });
    setChoices(generateChoices(problem.answer));
    setShowProblem(true);
  };
  
  const checkAnswer = (answer) => {
    const correct = answer === currentProblem.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setFeedback('🎉 Excellent! Well done!');
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setFeedback(`Good try! ${currentProblem.num1} × ${currentProblem.num2} = ${currentProblem.answer}`);
      setSessionStats(prev => ({ ...prev, total: prev.total + 1 }));
    }
    
    setTimeout(() => {
      setFeedback('');
      setIsCorrect(null);
      generateProblem();
    }, 2000);
  };
  
  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-orange-800">LogicRoot</h1>
              <p className="text-sm text-orange-600">Multiplication Mastery</p>
            </div>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setAuthView('signin')}
              className="px-6 py-2 text-orange-600 hover:text-orange-800 font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthView('signup')}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
            >
              Start Free Trial
            </button>
          </div>
        </header>
        
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Master Multiplication Facts in Just 
            <span className="text-orange-600"> 30 Days</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our scientifically-designed learning system helps children master all multiplication facts 
            through spaced repetition, adaptive difficulty, and engaging gameplay.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setAuthView('signup')}
              className="px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold text-lg shadow-lg"
            >
              Start Your Free Trial
            </button>
            <button
              onClick={() => {
                setUser({ id: 'demo', email: 'demo@example.com', name: 'Demo User' });
                setIsAuthenticated(true);
                setSubscriptionStatus('demo');
                setCurrentView('dashboard');
              }}
              className="px-8 py-4 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 font-bold text-lg"
            >
              Try Demo
            </button>
          </div>
          <p className="text-gray-500 mt-4">✨ 7-day free trial • No credit card required</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-orange-100">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Adaptive Learning</h3>
            <p className="text-gray-600">
              Our system adapts to your child's learning pace, focusing on facts they need to practice most.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-orange-100">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Progress Tracking</h3>
            <p className="text-gray-600">
              Detailed analytics help parents understand their child's learning journey and celebrate achievements.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-orange-100">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Proven Results</h3>
            <p className="text-gray-600">
              Based on cognitive science research, our tiered approach ensures lasting mastery of multiplication facts.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-orange-100">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Simple, Affordable Pricing</h3>
          <div className="flex justify-center items-center space-x-8">
            <div>
              <div className="text-3xl font-bold text-orange-600">$9.99</div>
              <div className="text-gray-600">per month</div>
            </div>
            <div className="text-gray-400">or</div>
            <div>
              <div className="text-3xl font-bold text-orange-600">$99.99</div>
              <div className="text-gray-600">per year (save 17%)</div>
            </div>
          </div>
          <p className="text-gray-600 mt-4">7-day free trial • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
  
  // Authentication Form Component - FIX: Use proper input handlers
  const AuthForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-orange-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🧠</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {authView === 'signin' ? 'Welcome Back' : 'Start Your Free Trial'}
          </h2>
          <p className="text-gray-600 mt-2">
            {authView === 'signin' 
              ? 'Sign in to continue learning' 
              : 'No credit card required for your 7-day trial'}
          </p>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          if (authView === 'signin') {
            signIn(authFormData.email, authFormData.password);
          } else {
            if (authFormData.password === authFormData.confirmPassword) {
              signUp(authFormData.email, authFormData.password, authFormData.name);
            } else {
              alert('Passwords do not match');
            }
          }
        }}>
          {authView === 'signup' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Parent Name
              </label>
              <input
                type="text"
                value={authFormData.name}
                onChange={(e) => handleAuthInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={authFormData.email}
              onChange={(e) => handleAuthInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={authFormData.password}
              onChange={(e) => handleAuthInputChange('password', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          {authView === 'signup' && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={authFormData.confirmPassword}
                onChange={(e) => handleAuthInputChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Loading...' : (authView === 'signin' ? 'Sign In' : 'Start Free Trial')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setAuthView(authView === 'signin' ? 'signup' : 'signin')}
            className="text-orange-600 hover:text-orange-800 font-medium"
          >
            {authView === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard Component - FIX: Use proper input handlers
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-lg">🧠</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">LogicRoot Multiplication</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-500" />
              <span className="text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Children</h2>
            <button
              onClick={() => setShowChildForm(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
            >
              <Plus className="mr-2" size={20} />
              Add Child
            </button>
          </div>
          
          {children.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">👶</span>
              <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                No children added yet
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first child to start their multiplication journey!
              </p>
              <button
                onClick={() => setShowChildForm(true)}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium"
              >
                Add Your First Child
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <div key={child.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{child.name}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{child.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-medium">15% complete</span>
                    </div>
                  </div>
                  <button
                    onClick={() => selectChild(child)}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 font-medium"
                  >
                    Start Practice
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showChildForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Child</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={childFormData.name}
                  onChange={(e) => handleChildInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Age
                </label>
                <select
                  value={childFormData.age}
                  onChange={(e) => handleChildInputChange('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select age</option>
                  {[6, 7, 8, 9, 10, 11, 12, 13, 14].map(age => (
                    <option key={age} value={age}>{age} years old</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={addChild}
                disabled={!childFormData.name || !childFormData.age || isAddingChild}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
              >
                {isAddingChild ? 'Adding...' : 'Add Child'}
              </button>
              <button
                onClick={() => {
                  setShowChildForm(false);
                  setChildFormData({ name: '', age: '' });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Game View Component
  const GameView = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-2 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200"
            >
              <ArrowRight className="rotate-180" size={20} />
            </button>
            <h1 className="text-3xl font-bold text-orange-800">
              {selectedChild?.name}'s Practice
            </h1>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">
              {tiers[currentTier].icon} {tiers[currentTier].name}
            </span>
            <span className="text-sm text-gray-600">
              Session: {sessionStats.correct}/{sessionStats.total} correct
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((sessionStats.correct / Math.max(sessionStats.total, 1)) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        {showProblem && currentProblem ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
            <div className="text-center mb-8">
              <div className="font-bold mb-4 flex items-center justify-center space-x-4 text-6xl">
                <span className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center">
                  {currentProblem.num1}
                </span>
                <span className="text-orange-500">×</span>
                <span className="bg-pink-100 rounded-full w-24 h-24 flex items-center justify-center">
                  {currentProblem.num2}
                </span>
                <span className="text-orange-500">=</span>
                <span className="text-gray-400">?</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => checkAnswer(choice)}
                  className="p-4 rounded-2xl font-bold text-2xl border-4 transition-all bg-yellow-50 border-yellow-300 hover:bg-yellow-100 hover:border-yellow-400"
                >
                  {choice}
                </button>
              ))}
            </div>
            
            {feedback && (
              <div className={`text-center mt-6 font-semibold text-xl ${
                isCorrect ? 'text-green-600' : 'text-blue-600'
              }`}>
                {feedback}
                {isCorrect && (
                  <div className="mt-2">
                    <div className="animate-bounce text-4xl">🎉</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <button
              onClick={generateProblem}
              className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-orange-700"
            >
              Start Practice Session
            </button>
          </div>
        )}
      </div>
    </div>

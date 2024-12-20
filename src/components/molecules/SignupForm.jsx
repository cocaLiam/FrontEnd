// /components/molecules/SignupForm.jsx
const SignupForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 로직 구현
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="signupEmail" className="sr-only">이메일</label>
          <input
            id="signupEmail"
            name="email"
            type="email"
            required
            className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이메일"
          />
        </div>
        <div>
          <label htmlFor="signupPassword" className="sr-only">비밀번호</label>
          <input
            id="signupPassword"
            name="password"
            type="password"
            required
            className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="비밀번호"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">비밀번호 확인</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="relative block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="비밀번호 확인"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        회원가입
      </button>
    </form>
  );
};

export default SignupForm;

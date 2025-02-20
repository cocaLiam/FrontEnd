=========SM-N960N, And 10, API 29=========
앱 최초 실행 / 빌드시
    onCreate() → onStart() → onResume()
OverView 버튼 클릭시 ( 잠금화면 시 )
    onPause() → onStop()
앱 강제 종료
    OverView 버튼 클릭시 상황 이후 그냥 종료됨
OverView 에서 다시 앱 킬 시
    onStart() → onResume()
뒤로가기 버튼 앱 종료시
    onPause() → onStop() → onDestroy()
뒤로가기 후 다시 킬 시
    onCreate() → onStart() → onResume()
화면 회전 시
    onPause() → onStop() → onDestroy() → onCreate() → onStart() → onResume()

=========SM-A325N, And 13, API 33=========
( finish() 함수 호출시 onDestroy 콜백 ON ! )
앱 최초 실행 / 빌드시
    onCreate() → onStart() → onResume()
OverView 버튼 클릭시 ( 잠금화면 시 )
    onPause() → onStop()
앱 강제 종료
    OverView 버튼 클릭시 상황 이후 그냥 종료됨
OverView 에서 다시 앱 킬 시
    onStart() → onResume()
뒤로가기 버튼 앱 종료시
    onPause() → onStop()
뒤로가기 후 다시 킬 시
    onCreate() → onStart() → onResume()
화면 회전 시
    onPause() → onStop() → onDestroy() → onCreate() → onStart()







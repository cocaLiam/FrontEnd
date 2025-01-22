// src/pages/My.jsx
import { useState } from "react";

import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";
import DebugIcon from "@/components/atoms/icons/DebugIcon";

import UserInfoSettingForm from "@/components/molecules/my_forms/UserInfoSettingForm";

export default function My() {
  const [isUserInfoSettingFormOpen, setUserInfoSettingFormOpen] = useState(false);

  return (
    <div className="flex flex-col px-2 py-8 space-y-3">
      {/* 계정 정보 변경 버튼 */}
      <ButtonWithIcon
        icon={DebugIcon}
        content="계정 정보 변경"
        onClick={() => setUserInfoSettingFormOpen(true)} // 상태를 true로 변경
      />
      
      {/* UserInfoSettingForm 컴포넌트 조건부 렌더링 */}
      {isUserInfoSettingFormOpen && (
        <UserInfoSettingForm
          setUserInfoSettingFormOpen={setUserInfoSettingFormOpen} // 상태 변경 함수 전달
        />
      )}
      
      <ButtonWithIcon
        icon={DebugIcon}
        content="그룹 정보 관리"
        onClick={() => {console.log("그룹 정보 관리")}}
      />
    </div>
  );
}
 
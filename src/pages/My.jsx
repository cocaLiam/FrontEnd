// src/pages/My.jsx
import { useState } from "react";

import ButtonWithIcon from "@/components/atoms/ButtonWithIcon";
import DebugIcon from "@/components/atoms/icons/DebugIcon";

import UserInfoSettingForm from "@/components/molecules/my_forms/UserInfoSettingForm";
import GroupManager from "@/components/molecules/my_forms/GroupManagingForm";

export default function My() {
  const [isUserInfoSettingFormOpen, setUserInfoSettingFormOpen] = useState(false);
  const [isGroupManagingFormOpen, setGroupManagingFormOpen] = useState(false);

  return (
    <div className="flex flex-col px-2 py-8 space-y-3">
      {isUserInfoSettingFormOpen && (
        <UserInfoSettingForm
          setUserInfoSettingFormOpen={setUserInfoSettingFormOpen} // 상태 변경 함수 전달
        />
      )}
      {isGroupManagingFormOpen && (
        <GroupManager
        setGroupManagingFormOpen={setGroupManagingFormOpen} // 상태 변경 함수 전달
        />
      )}

      {/* 계정 정보 변경 버튼 */}
      <ButtonWithIcon
        icon={DebugIcon}
        content="계정 정보 변경"
        onClick={() => setUserInfoSettingFormOpen(true)} // 상태를 true로 변경
      />
      <ButtonWithIcon
        icon={DebugIcon}
        content="그룹 정보 관리"
        onClick={() => setGroupManagingFormOpen(true)} // 상태를 true로 변경
      />
    </div>
  )}
 
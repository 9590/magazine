"use client";

import Link from "next/link";
import { useState } from "react";

// 定义菜单项接口
interface MenuItem {
  id: string;
  label: string;
  url: string;
  childItems: {
    nodes: MenuItem[];
  };
}

const NewsTicker = ({ menuItems = [] }: { menuItems: MenuItem[] }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null); // 当前展开的一级菜单ID

  // 切换一级菜单时，控制子菜单的显示和隐藏
  const handleItemClick = (itemId: string) => {
    if (activeItem === itemId) {
      setActiveItem(null); // 如果点击的是当前已经展开的菜单，则收起子菜单
    } else {
      setActiveItem(itemId); // 展开点击的菜单对应的子菜单
    }
  };

  return (
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-6">
          {menuItems.map((item) => (
              <li key={item.id} className="relative">
                <button
                    onClick={() => handleItemClick(item.id)}
                    className="hover:text-gray-300"
                >
                  {item.label}
                </button>

                {/* 如果当前菜单项有子菜单，显示子菜单 */}
                {activeItem === item.id && item.childItems.nodes.length > 0 && (
                    <ul className="absolute left-0 mt-2 bg-white text-black rounded shadow-lg z-10">
                      {item.childItems.nodes.map((child) => (
                          <li key={child.id}>
                            <Link
                                href={child.url}
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                              {child.label}
                            </Link>
                          </li>
                      ))}
                    </ul>
                )}
              </li>
          ))}
        </ul>
      </nav>
  );
};

export default NewsTicker;

import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
    {
        title: 'Home',
        path: '/home',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text',
        private: false
    },
    {
        title: 'Perfil',
        path: '/profile',
        icon: <FaIcons.FaUser />,
        cName: 'nav-text',
        private: true
    },
    {
        title: 'Relatórios',
        path: null,
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text',
        private: true,
        subNav: [
            {
                title: 'Consumo de água',
                path: '/water-intake-report',
                icon: <IoIcons.IoIosPaper />,
                cName: 'nav-text',
                private: true
            },
            {
                title: 'Controle de peso',
                path: '/weight-control-report',
                icon: <IoIcons.IoIosPaper />,
                cName: 'nav-text',
                private: true
            }
        ]
    },
    {
        title: 'Team',
        path: '/team',
        icon: <IoIcons.IoMdPeople />,
        cName: 'nav-text',
        private: false
    },
    {
        title: 'Messages',
        path: '/messages',
        icon: <FaIcons.FaEnvelopeOpenText />,
        cName: 'nav-text',
        private: false
    },
    {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text',
        private: false
    }
];
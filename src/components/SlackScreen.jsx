import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

const SlackFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap');
`;

const SlackContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1a1d21;
  font-family: 'Lato', 'Slack-Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
`;

const TopSearchBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: rgba(21, 25, 30, 1);
  border-bottom: 1px solid #3a3d42;
`;

const SearchInput = styled.div`
  flex: 1;
  max-width: 720px;
  background: #3a3d42;
  border-radius: 6px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  cursor: text;
  
  &:hover {
    background: #44474c;
  }
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: absolute;
  right: 16px;
`;

const TopBarIcon = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 4px;
  background: #e01e5a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: white;
  cursor: pointer;
`;

const MainArea = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const PrimaryNav = styled.div`
  width: 70px;
  background: rgba(21, 25, 30, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  gap: 4px;
  border-right: 1px solid #3a3d42;
`;

const PrimaryNavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 8px;
  cursor: pointer;
  width: 54px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const PrimaryNavLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
`;

const PrimaryNavDivider = styled.div`
  width: 36px;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 8px 0;
`;

const Sidebar = styled.div`
  width: 260px;
  background: rgba(27, 29, 33, 1);
  display: flex;
  flex-direction: column;
  border-right: 1px solid #3a3d42;
  border-radius: 8px 0px 0px 0px;
`;

const WorkspaceHeader = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WorkspaceName = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: white;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  padding: 4px 8px;
  margin: -4px -8px;
  border-radius: 6px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const WorkspaceIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #000000;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  font-family: 'Zendesk Sans', sans-serif;
  
  &::after {
    content: 'Z';
  }
`;

const AddButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-top: 16px;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const SectionToggle = styled.span`
  margin-right: 4px;
  font-size: 18px;
`;

const ChannelList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChannelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 20px 4px 16px;
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.$active ? '#1164a3' : 'transparent'};
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: ${props => props.$active ? '#1164a3' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ChannelIcon = styled.span`
  font-size: 18px;
  opacity: 0.7;
  width: 20px;
  text-align: center;
`;

const UnreadBadge = styled.span`
  margin-left: auto;
  background: #e01e5a;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 0 6px;
  border-radius: 9px;
  min-width: 18px;
  text-align: center;
`;

const DMList = styled.div`
  display: flex;
  flex-direction: column;
`;

const DMItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 20px 4px 16px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Avatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.$color || '#6b6f76'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
  position: relative;
`;

const OnlineDot = styled.div`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #2eb67d;
  border: 2px solid rgba(27, 29, 33, 1);
  position: absolute;
  bottom: -3px;
  right: -3px;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1d21;
  border-radius: 8px 0px 0px 0px;
  overflow: hidden;
`;

const ChannelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid #3a3d42;
`;

const ChannelHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChannelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: white;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  padding: 4px 8px;
  margin: -4px -8px;
  border-radius: 6px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ChannelDescription = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 15px;
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  margin-left: 8px;
`;

const ChannelHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MembersButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Message = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.02);
    margin: 0 -20px;
    padding: 8px 20px;
  }
`;

const MessageAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.$color || '#6b6f76'};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: white;
`;

const AppAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #000000;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    filter: brightness(0) invert(1);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
`;

const MessageAuthor = styled.span`
  color: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AppBadge = styled.span`
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  font-weight: 600;
  padding: 0 4px;
  border-radius: 3px;
  text-transform: uppercase;
`;

const MessageTime = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
`;

const MessageText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  line-height: 1.46668;
`;

const AlertCard = styled.div`
  border-left: 4px solid ${props => props.$color || '#e01e5a'};
  padding: 0 0 0 12px;
  margin-top: 4px;
  max-width: 600px;
`;

const AlertTitle = styled.div`
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AlertSection = styled.div`
  margin: 12px 0;
`;

const AlertSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const AlertList = styled.ul`
  margin: 4px 0;
  padding-left: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  line-height: 1.5;
  list-style-type: disc;
  
  li {
    margin-bottom: 2px;
    padding-left: 4px;
  }
`;

const AlertMeta = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  margin-top: 8px;
  line-height: 1.46668;
`;

const AlertButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const AlertButton = styled.button`
  background: ${props => props.$primary ? '#007a5a' : 'transparent'};
  color: ${props => props.$primary ? 'white' : 'rgba(255, 255, 255, 0.9)'};
  border: ${props => props.$primary ? 'none' : '1px solid rgba(255,255,255,0.3)'};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  
  &:hover {
    background: ${props => props.$primary ? '#148567' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const MessageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`;

const Reaction = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 16px;
  padding: 2px 8px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-family: inherit;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const ThreadLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1d9bd1;
  font-size: 14px;
  cursor: pointer;
  margin-top: 6px;
  padding: 4px 0;
  
  &:hover span {
    text-decoration: underline;
  }
`;

const ThreadAvatars = styled.div`
  display: flex;
`;

const MiniAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.$color || '#6b6f76'};
  margin-left: -6px;
  border: 2px solid #1a1d21;
  overflow: hidden;
  
  &:first-child {
    margin-left: 0;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InputArea = styled.div`
  padding: 0 20px 20px 20px;
`;

const InputBox = styled.div`
  background: #222529;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
`;

const InputToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 12px 4px 12px;
`;

const ToolbarButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const InputPlaceholder = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  padding: 4px 12px 12px 12px;
`;

const InputFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px 8px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SendButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NewAlertContainer = styled.div`
  animation: ${slideIn} 0.4s ease-out;
`;

const HomeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2.5L2.5 8.75V17.5H7.5V12.5H12.5V17.5H17.5V8.75L10 2.5Z"/>
  </svg>
);

const DMsIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 3V5a1 1 0 011-1z"/>
  </svg>
);

const ActivityIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
  </svg>
);

const FilesIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 4v12a2 2 0 002 2h8a2 2 0 002-2V7l-4-4H6a2 2 0 00-2 2z"/>
    <path d="M12 3v4h4"/>
  </svg>
);

const LaterIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 4a2 2 0 00-2 2v12l7-4 7 4V6a2 2 0 00-2-2H5z"/>
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <circle cx="4" cy="10" r="2"/>
    <circle cx="10" cy="10" r="2"/>
    <circle cx="16" cy="10" r="2"/>
  </svg>
);

function SlackScreen({ onViewDashboard }) {
  const [showNewAlert, setShowNewAlert] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewAlert(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showNewAlert && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showNewAlert]);

  return (
    <>
      <SlackFonts />
      <SlackContainer>
        <TopSearchBar>
          <SearchInput>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" opacity="0.7">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            Search Acme
          </SearchInput>
        </TopSearchBar>
        
        <MainArea>
          <PrimaryNav>
            <PrimaryNavItem>
              <HomeIcon />
              <PrimaryNavLabel>Home</PrimaryNavLabel>
            </PrimaryNavItem>
            <PrimaryNavItem>
              <DMsIcon />
              <PrimaryNavLabel>DMs</PrimaryNavLabel>
            </PrimaryNavItem>
            <PrimaryNavItem>
              <ActivityIcon />
              <PrimaryNavLabel>Activity</PrimaryNavLabel>
            </PrimaryNavItem>
            <PrimaryNavItem>
              <FilesIcon />
              <PrimaryNavLabel>Files</PrimaryNavLabel>
            </PrimaryNavItem>
            <PrimaryNavItem>
              <LaterIcon />
              <PrimaryNavLabel>Later</PrimaryNavLabel>
            </PrimaryNavItem>
            <PrimaryNavDivider />
            <PrimaryNavItem>
              <MoreIcon />
              <PrimaryNavLabel>More</PrimaryNavLabel>
            </PrimaryNavItem>
            
            <div style={{ flex: 1 }} />
            
            <AddButton style={{ marginBottom: '16px' }}>+</AddButton>
          </PrimaryNav>
          
          <Sidebar>
            <WorkspaceHeader>
              <WorkspaceName>
                Acme
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </WorkspaceName>
            </WorkspaceHeader>
            
            <SectionHeader>
              <SectionToggle>▾</SectionToggle>
              Channels
            </SectionHeader>
            
            <ChannelList>
              <ChannelItem><ChannelIcon>#</ChannelIcon> general</ChannelItem>
              <ChannelItem><ChannelIcon>#</ChannelIcon> announcements</ChannelItem>
              <ChannelItem $active><ChannelIcon>#</ChannelIcon> ops-issues <UnreadBadge>3</UnreadBadge></ChannelItem>
              <ChannelItem><ChannelIcon>#</ChannelIcon> customer-experience</ChannelItem>
              <ChannelItem><ChannelIcon>#</ChannelIcon> ai-alerts <UnreadBadge>2</UnreadBadge></ChannelItem>
              <ChannelItem><ChannelIcon>#</ChannelIcon> escalations</ChannelItem>
              <ChannelItem><ChannelIcon>#</ChannelIcon> engineering</ChannelItem>
            </ChannelList>
            
            <SectionHeader>
              <SectionToggle>▾</SectionToggle>
              Direct messages
            </SectionHeader>
            
            <DMList>
              <DMItem>
                <Avatar $color="#4a9c6d">
                  SC
                  <OnlineDot />
                </Avatar>
                Sarah Chen
              </DMItem>
              <DMItem>
                <Avatar $color="#e2a03f">JO</Avatar>
                James Okafor
              </DMItem>
              <DMItem>
                <Avatar $color="#d64292">PN</Avatar>
                Priya Nair
              </DMItem>
            </DMList>
          </Sidebar>
          
          <MainContent>
            <ChannelHeader>
              <ChannelHeaderLeft>
                <ChannelTitle>
                  <span style={{ opacity: 0.7 }}>#</span> ops-issues
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginLeft: '2px' }}>
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </ChannelTitle>
                <ChannelDescription>Operational alerts and incident tracking</ChannelDescription>
              </ChannelHeaderLeft>
              <ChannelHeaderRight>
                <MembersButton>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z"/>
                  </svg>
                  12
                </MembersButton>
              </ChannelHeaderRight>
            </ChannelHeader>
            
            <MessagesArea>
              <Message>
                <MessageAvatar $color="#e2a03f">JO</MessageAvatar>
                <MessageContent>
                  <MessageHeader>
                    <MessageAuthor>James Okafor</MessageAuthor>
                    <MessageTime>4:52 PM</MessageTime>
                  </MessageHeader>
                  <MessageText>
                    checked with logistics — ShipFast reporting a partial outage on their tracking API. ETA for fix is unclear 😕
                  </MessageText>
                </MessageContent>
              </Message>
              
              <Message>
                <MessageAvatar $color="#4a9c6d">SC</MessageAvatar>
                <MessageContent>
                  <MessageHeader>
                    <MessageAuthor>Sarah Chen</MessageAuthor>
                    <MessageTime>5:13 PM</MessageTime>
                  </MessageHeader>
                  <MessageText>
                    ok escalating this. VIP customers are in the mix and sentiment is going to tank if we don't get eyes on these
                  </MessageText>
                </MessageContent>
              </Message>
              
              <Message>
                <AppAvatar>
                  <img src="/rtm2026/Logo.png" alt="Zendesk" />
                </AppAvatar>
                <MessageContent>
                  <MessageHeader>
                    <MessageAuthor>Zendesk</MessageAuthor>
                    <AppBadge>APP</AppBadge>
                    <MessageTime>5:30 PM</MessageTime>
                  </MessageHeader>
                  <AlertCard $color="#f2c744">
                    <MessageText style={{ marginBottom: '4px' }}>
                      Tickets in standard queue (Messaging) &gt; 100<br/>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Breach value: 112</span>
                    </MessageText>
                    <MessageText style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                      Group: Billing, Refunds +3; Brand: HappyPaws, BuddyBites +2;<br/>
                      Channel: WhatsApp<br/>
                      Possible reason: Spike in payment related tickets from 14:30
                    </MessageText>
                    <AlertButton>View dashboard</AlertButton>
                  </AlertCard>
                  <MessageActions>
                    <Reaction>👀 1</Reaction>
                  </MessageActions>
                  <ThreadLink>
                    <ThreadAvatars>
                      <MiniAvatar $color="#4a9c6d" />
                      <MiniAvatar $color="#6b6f76" />
                    </ThreadAvatars>
                    <span>4 replies</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>View thread</span>
                  </ThreadLink>
                </MessageContent>
              </Message>
              
              {showNewAlert && (
                <NewAlertContainer>
                  <Message>
                    <AppAvatar>
                      <img src="/rtm2026/Logo.png" alt="Zendesk" />
                    </AppAvatar>
                    <MessageContent>
                      <MessageHeader>
                        <MessageAuthor>Zendesk</MessageAuthor>
                        <AppBadge>APP</AppBadge>
                        <MessageTime>11:43 AM</MessageTime>
                      </MessageHeader>
                      <AlertCard $color="#e01e5a">
                        <AlertTitle>
                          🚨 Escalation rate increased to 42%
                        </AlertTitle>
                        <MessageText>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Current value</span> <strong>42%</strong> (up from 22%)<br/>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Detected</span> Jul 2, 2026, 11:42 AM
                        </MessageText>
                        
                        <AlertSection>
                          <AlertSectionTitle>Related Metrics</AlertSectionTitle>
                          <AlertList>
                            <li>"Payment issues" use case escalation rate: 73%</li>
                            <li>Billing queue volume: 45 conversations (baseline: 25)</li>
                          </AlertList>
                        </AlertSection>
                        
                        <AlertSection>
                          <AlertSectionTitle>Impact</AlertSectionTitle>
                          <MessageText>AI agents are escalating more cases, Billing queue overwhelmed.</MessageText>
                        </AlertSection>
                        
                        <AlertButtons>
                          <AlertButton $primary onClick={onViewDashboard}>View recommendations</AlertButton>
                          <AlertButton>View dashboard</AlertButton>
                        </AlertButtons>
                      </AlertCard>
                    </MessageContent>
                  </Message>
                </NewAlertContainer>
              )}
              
              <div ref={messagesEndRef} />
            </MessagesArea>
            
            <InputArea>
              <InputBox>
                <InputToolbar>
                  <ToolbarButton>B</ToolbarButton>
                  <ToolbarButton style={{ fontStyle: 'italic' }}>I</ToolbarButton>
                  <ToolbarButton>🔗</ToolbarButton>
                  <ToolbarButton>≡</ToolbarButton>
                </InputToolbar>
                <InputPlaceholder>Message #ops-issues</InputPlaceholder>
                <InputFooter>
                  <FooterLeft>
                    <ToolbarButton>+</ToolbarButton>
                    <ToolbarButton>😊</ToolbarButton>
                    <ToolbarButton>@</ToolbarButton>
                    <ToolbarButton>📎</ToolbarButton>
                  </FooterLeft>
                  <FooterRight>
                    <SendButton>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11z"/>
                      </svg>
                    </SendButton>
                  </FooterRight>
                </InputFooter>
              </InputBox>
            </InputArea>
          </MainContent>
        </MainArea>
      </SlackContainer>
    </>
  );
}

export default SlackScreen;

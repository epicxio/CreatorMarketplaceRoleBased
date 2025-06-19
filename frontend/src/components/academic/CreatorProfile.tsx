import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Chip, Divider, Tooltip, Tabs, Tab, IconButton } from '@mui/material';
import { Instagram, Facebook, YouTube, Language, LocationOn, Male, Female, EmojiEvents, TrendingUp, BarChart, AccessTime, Tag, Public, Group, InsertChart, Favorite, Comment, Share, Visibility } from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';
import { useParams } from 'react-router-dom';

// Mock data for a creator
const creator = {
  id: '1',
  name: 'Cathy Creator',
  bio: 'Lifestyle & Travel Influencer. Sharing my adventures and tips for a vibrant life!',
  avatar: '',
  platforms: [
    { name: 'Instagram', icon: <Instagram color="secondary" />, followers: 120000, growth: 8, engagement: 4.2 },
    { name: 'Facebook', icon: <Facebook color="primary" />, followers: 45000, growth: 2, engagement: 2.1 },
    { name: 'YouTube', icon: <YouTube color="error" />, followers: 80000, growth: 5, engagement: 3.5 },
  ],
  region: 'India',
  languages: [ { name: 'English', percent: 60 }, { name: 'Hindi', percent: 30 }, { name: 'Tamil', percent: 10 } ],
  geo: [ { country: 'India', percent: 70 }, { country: 'USA', percent: 15 }, { country: 'UK', percent: 10 }, { country: 'Other', percent: 5 } ],
  gender: [ { gender: 'Female', percent: 65 }, { gender: 'Male', percent: 35 } ],
  age: [ { group: '13-17', percent: 10 }, { group: '18-24', percent: 40 }, { group: '25-34', percent: 30 }, { group: '35+', percent: 20 } ],
  topPosts: [
    { id: 1, platform: 'Instagram', img: '', likes: 12000, comments: 800, shares: 200, date: '2024-05-01' },
    { id: 2, platform: 'YouTube', img: '', likes: 9000, comments: 600, shares: 150, date: '2024-04-20' },
    { id: 3, platform: 'Facebook', img: '', likes: 7000, comments: 400, shares: 100, date: '2024-04-10' },
  ],
  bestTimes: [
    { day: 'Mon', hour: '6PM', engagement: 4.5 },
    { day: 'Wed', hour: '8PM', engagement: 5.2 },
    { day: 'Fri', hour: '7PM', engagement: 4.8 },
  ],
  hashtags: [ { tag: '#travel', count: 120 }, { tag: '#lifestyle', count: 90 }, { tag: '#adventure', count: 70 } ],
  campaigns: [
    { brand: 'BrandX', logo: '', reach: 50000, engagement: 3.8, value: '$2,000' },
    { brand: 'BrandY', logo: '', reach: 30000, engagement: 4.1, value: '$1,200' },
  ],
  recentActivity: [
    { type: 'post', platform: 'Instagram', date: '2024-05-01', desc: 'Posted a new travel reel.' },
    { type: 'comment', platform: 'YouTube', date: '2024-04-28', desc: 'Replied to a fan comment.' },
    { type: 'story', platform: 'Instagram', date: '2024-04-25', desc: 'Shared a story from Goa.' },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0'];

const CreatorProfile: React.FC = () => {
  const { id } = useParams();
  // In real app, fetch creator by id

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e1e2f 0%, #23234a 100%)',
        py: { xs: 3, md: 8 },
        px: { xs: 1, md: 0 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mb: 6,
          borderRadius: 6,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          p: { xs: 5, md: 8 },
          position: 'relative',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Avatar, Name, Bio */}
        <Avatar
          src={creator.avatar}
          sx={{
            width: 120,
            height: 120,
            bgcolor: 'primary.main',
            fontSize: 48,
            boxShadow: '0 0 32px 8px #6C63FF55',
            border: '4px solid #fff',
            animation: 'pulseGlow 2.5s infinite',
            '@keyframes pulseGlow': {
              '0%': { boxShadow: '0 0 32px 8px #6C63FF55' },
              '50%': { boxShadow: '0 0 64px 16px #6C63FF99' },
              '100%': { boxShadow: '0 0 32px 8px #6C63FF55' },
            },
            mb: 3,
          }}
        >
          {creator.name.split(' ').map(n => n[0]).join('')}
        </Avatar>
        <Typography variant="h3" fontWeight={900} color="#fff" sx={{ letterSpacing: 1, mb: 1, textAlign: 'center' }}>
          {creator.name}
        </Typography>
        <Typography variant="h6" color="#cfd8dc" sx={{ mb: 4, fontWeight: 400, lineHeight: 1.5, textAlign: 'center', maxWidth: 600 }}>
          {creator.bio}
        </Typography>
        {/* Platform Badges */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            mb: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {creator.platforms.map((p, i) => (
            <Chip
              key={p.name}
              icon={p.icon}
              label={p.name}
              color="default"
              size="medium"
              sx={{
                bgcolor: 'rgba(255,255,255,0.18)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.1rem',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 2px 8px #6C63FF33',
                border: '1px solid #6C63FF44',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.08)' },
              }}
            />
          ))}
        </Box>
        {/* Platform Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 4,
            width: '100%',
            maxWidth: 900,
            justifyContent: 'center',
          }}
        >
          {creator.platforms.map((p, i) => (
            <Box
              key={p.name}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.13)',
                borderRadius: 4,
                px: 4,
                py: 3,
                boxShadow: '0 2px 8px #6C63FF22',
                minWidth: 200,
                maxWidth: 260,
                mx: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {p.icon}
                <Typography color="#fff" fontWeight={800} sx={{ fontSize: '1.5rem', letterSpacing: 0.5 }}>{p.followers.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Chip icon={<Favorite fontSize="small" />} label={`${p.engagement}%`} color="success" size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', px: 2, py: 1, borderRadius: 2 }} />
                <Chip icon={<TrendingUp fontSize="small" />} label={`+${p.growth}%`} color="primary" size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', px: 2, py: 1, borderRadius: 2 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Unified Analytics Panel */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          borderRadius: 6,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          background: 'rgba(255,255,255,0.13)',
          backdropFilter: 'blur(18px)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          p: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 7,
          mb: 7,
          position: 'relative',
        }}
      >
        {/* Left: Audience Demographics */}
        <Box sx={{ flex: 1.2, minWidth: 260, pr: { md: 6 }, borderRight: { md: '1.5px solid rgba(255,255,255,0.12)' }, mb: { xs: 5, md: 0 } }}>
          <Typography fontWeight={800} color="#fff" sx={{ mb: 4, fontSize: '1.5rem', letterSpacing: 0.5 }}>Audience Demographics</Typography>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn color="error" sx={{ mr: 1.5 }} />
              <Typography fontWeight={700} color="#fff">Top Regions</Typography>
            </Box>
            <PieChart width={160} height={100}>
              <Pie data={creator.geo} dataKey="percent" nameKey="country" cx="50%" cy="50%" outerRadius={40} fill="#8884d8" label>
                {creator.geo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Language color="primary" sx={{ mr: 1.5 }} />
              <Typography fontWeight={700} color="#fff">Languages</Typography>
            </Box>
            <PieChart width={160} height={100}>
              <Pie data={creator.languages} dataKey="percent" nameKey="name" cx="50%" cy="50%" outerRadius={40} fill="#82ca9d" label>
                {creator.languages.map((entry, index) => (
                  <Cell key={`cell-lang-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Group color="info" sx={{ mr: 1.5 }} />
              <Typography fontWeight={700} color="#fff">Gender</Typography>
            </Box>
            <PieChart width={160} height={100}>
              <Pie data={creator.gender} dataKey="percent" nameKey="gender" cx="50%" cy="50%" outerRadius={40} fill="#ffc658" label>
                {creator.gender.map((entry, index) => (
                  <Cell key={`cell-gender-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChart color="secondary" sx={{ mr: 1.5 }} />
              <Typography fontWeight={700} color="#fff">Age Groups</Typography>
            </Box>
            <ReBarChart width={160} height={100} data={creator.age}>
              <XAxis dataKey="group" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Bar dataKey="percent" fill="#8884d8" />
              <ReTooltip />
            </ReBarChart>
          </Box>
        </Box>
        {/* Center: Content Analytics */}
        <Box sx={{ flex: 1.5, minWidth: 320, px: { md: 6 }, borderRight: { md: '1.5px solid rgba(255,255,255,0.12)' }, mb: { xs: 5, md: 0 } }}>
          <Typography fontWeight={800} color="#fff" sx={{ mb: 4, fontSize: '1.5rem', letterSpacing: 0.5 }}>Content Analytics</Typography>
          {/* Top Posts Carousel */}
          <Box sx={{ mb: 5 }}>
            <Typography fontWeight={700} color="#fff" sx={{ mb: 2 }}>Top Posts</Typography>
            <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
              {creator.topPosts.map((post, i) => (
                <Card key={post.id} sx={{ minWidth: 150, maxWidth: 200, borderRadius: 3, boxShadow: 2, p: 2.5, bgcolor: 'rgba(255,255,255,0.13)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.07)' }, border: '1.5px solid #6C63FF33' }}>
                  <Avatar src={post.img} sx={{ width: 44, height: 44, mb: 1.5, bgcolor: 'grey.200' }}>
                    <InsertChart color="primary" />
                  </Avatar>
                  <Typography variant="caption" color="#fff" sx={{ mb: 1, fontWeight: 700 }}>{post.platform}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Favorite fontSize="small" color="error" />
                    <Typography variant="caption" color="#fff" sx={{ fontWeight: 700 }}>{post.likes}</Typography>
                    <Comment fontSize="small" color="primary" />
                    <Typography variant="caption" color="#fff" sx={{ fontWeight: 700 }}>{post.comments}</Typography>
                    <Share fontSize="small" color="secondary" />
                    <Typography variant="caption" color="#fff" sx={{ fontWeight: 700 }}>{post.shares}</Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
          <Box sx={{ mb: 5 }}>
            <Typography fontWeight={700} color="#fff" sx={{ mb: 2 }}>Best Times to Post</Typography>
            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
              {creator.bestTimes.map((t, i) => (
                <Chip key={i} icon={<AccessTime />} label={`${t.day} ${t.hour}`} color="info" sx={{ fontWeight: 700, fontSize: '1.1rem', bgcolor: 'rgba(255,255,255,0.13)', color: '#fff', px: 2, py: 1, borderRadius: 2 }} />
              ))}
            </Box>
          </Box>
          <Box>
            <Typography fontWeight={700} color="#fff" sx={{ mb: 2 }}>Top Hashtags</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {creator.hashtags.map((h, i) => (
                <Chip key={h.tag} icon={<Tag />} label={`${h.tag} (${h.count})`} color="primary" sx={{ fontWeight: 700, fontSize: '1.1rem', bgcolor: 'rgba(255,255,255,0.13)', color: '#fff', px: 2, py: 1, borderRadius: 2 }} />
              ))}
            </Box>
          </Box>
        </Box>
        {/* Right: Campaigns & Activity */}
        <Box sx={{ flex: 1, minWidth: 260, pl: { md: 6 }, pr: { xs: 1, md: 3 } }}>
          <Typography fontWeight={800} color="#fff" sx={{ mb: 4, fontSize: '1.5rem', letterSpacing: 0.5 }}>Campaigns & Activity</Typography>
          <Box sx={{ mb: 5 }}>
            <Typography fontWeight={700} color="#fff" sx={{ mb: 2 }}>Campaigns & Collaborations</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {creator.campaigns.map((c, i) => (
                <Card key={c.brand} sx={{ p: 2.5, borderRadius: 3, boxShadow: 1, bgcolor: 'rgba(255,255,255,0.13)', display: 'flex', alignItems: 'center', minHeight: 70, border: '1.5px solid #6C63FF33' }}>
                  <Avatar src={c.logo} sx={{ mr: 2, bgcolor: 'secondary.main', width: 44, height: 44 }}>
                    <EmojiEvents />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={800} color="#fff" sx={{ fontSize: '1.1rem' }}>{c.brand}</Typography>
                    <Typography variant="body2" color="#fff" sx={{ fontWeight: 600 }}>Reach: {c.reach.toLocaleString()}</Typography>
                    <Typography variant="body2" color="#fff" sx={{ fontWeight: 600 }}>Engagement: {c.engagement}%</Typography>
                    <Typography variant="body2" color="#fff" sx={{ fontWeight: 600 }}>Value: {c.value}</Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography fontWeight={700} color="#fff" sx={{ mb: 2 }}>Recent Activity</Typography>
            <Box>
              {creator.recentActivity.map((a, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2.5,
                    flexWrap: 'wrap',
                    gap: 1.5,
                    pr: 2,
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Chip icon={<Visibility />} label={a.type} color="info" size="small" sx={{ fontWeight: 700, fontSize: '1.1rem', bgcolor: 'rgba(255,255,255,0.13)', color: '#fff', px: 2, py: 1, borderRadius: 2 }} />
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, minWidth: 80 }}>{a.platform}</Typography>
                  <Typography variant="body2" color="#fff" sx={{ fontWeight: 600, minWidth: 90 }}>{a.date}</Typography>
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, flex: 1, minWidth: 120, maxWidth: 220, wordBreak: 'break-word' }}>{a.desc}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatorProfile; 
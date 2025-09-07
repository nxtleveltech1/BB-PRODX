"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Heart,
  Moon,
  Sun,
  Activity,
  Brain,
  Leaf,
  TrendingUp,
  Star,
  Target,
  Users,
  Award,
  ChevronRight,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';

// Mock data for wellness metrics
const wellnessData = {
  todayMetrics: {
    mood: 8.2,
    energy: 7.5,
    sleep: 6.8,
    stress: 3.2
  },
  weeklyProgress: {
    meditation: 85,
    exercise: 72,
    nutrition: 91,
    mindfulness: 78
  },
  goals: [
    { id: 1, title: "Daily Meditation", progress: 85, target: 100, unit: "minutes" },
    { id: 2, title: "Active Hours", progress: 6, target: 8, unit: "hours" },
    { id: 3, title: "Water Intake", progress: 7, target: 8, unit: "glasses" },
    { id: 4, title: "Sleep Quality", progress: 7.2, target: 8.0, unit: "score" }
  ],
  insights: [
    "Your meditation consistency has improved 23% this week",
    "Peak energy levels occur around 10 AM - perfect for focused work",
    "Your sleep pattern shows improvement with 15 minutes earlier bedtime"
  ],
  premiumFeatures: [
    { title: "AI Wellness Coach", description: "Personalized daily guidance", icon: Brain },
    { title: "Advanced Analytics", description: "Deep insights into your patterns", icon: TrendingUp },
    { title: "Community Circle", description: "Connect with wellness mentors", icon: Users },
    { title: "Premium Content", description: "Exclusive meditation & workouts", icon: Crown }
  ]
};

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  description, 
  trend 
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  description: string;
  trend?: string;
}) => (
  <Card className="relative overflow-hidden group transition-all duration-500 hover:shadow-wellness border-0 bg-white/90 backdrop-blur-sm">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <Badge variant="secondary" className="bg-bb-champagne-200/50 text-bb-black-bean border-0">
            {trend}
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-heading text-bb-black-bean">
            {value.toFixed(1)}
          </span>
          <span className="text-sm text-bb-black-bean/60 font-serif">/ 10</span>
        </div>
        <h3 className="font-heading text-bb-black-bean font-semibold tracking-wide uppercase text-sm">
          {title}
        </h3>
        <p className="text-xs text-bb-black-bean/70 font-serif leading-relaxed">
          {description}
        </p>
      </div>
    </CardContent>
  </Card>
);

const ProgressGoal = ({ goal }: { goal: typeof wellnessData.goals[0] }) => (
  <Card className="group transition-all duration-300 hover:shadow-md border-0 bg-white/80 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-heading text-bb-black-bean font-semibold uppercase tracking-wide text-sm">
            {goal.title}
          </h4>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-bb-black-bean font-heading">
              {goal.progress}
            </span>
            <span className="text-sm text-bb-black-bean/60 font-serif">
              / {goal.target} {goal.unit}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-bb-black-bean/60 font-serif mb-1">
            {Math.round((goal.progress / goal.target) * 100)}%
          </div>
          {goal.progress >= goal.target ? (
            <Award className="h-5 w-5 text-bb-mahogany" />
          ) : (
            <Target className="h-5 w-5 text-bb-black-bean/40" />
          )}
        </div>
      </div>
      <Progress 
        value={(goal.progress / goal.target) * 100} 
        className="h-2 bg-bb-champagne-200"
      />
    </CardContent>
  </Card>
);

const InsightCard = ({ insight, index }: { insight: string; index: number }) => (
  <div 
    className="p-4 rounded-xl bg-gradient-to-r from-bb-champagne-100 to-bb-champagne-200 border border-bb-champagne-300 group transition-all duration-300 hover:shadow-md animate-fade-in-up"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-start gap-3">
      <div className="p-2 bg-bb-mahogany rounded-lg shrink-0">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <p className="font-serif text-bb-black-bean text-sm leading-relaxed">
        {insight}
      </p>
    </div>
  </div>
);

const PremiumFeatureCard = ({ feature }: { feature: typeof wellnessData.premiumFeatures[0] }) => (
  <Card className="group cursor-pointer transition-all duration-500 hover:shadow-wellness hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-bb-champagne-50">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-r from-bb-mahogany to-bb-citron rounded-xl group-hover:scale-110 transition-transform duration-300">
          <feature.icon className="h-6 w-6 text-white" />
        </div>
        <ChevronRight className="h-5 w-5 text-bb-black-bean/40 group-hover:text-bb-mahogany group-hover:translate-x-1 transition-all duration-300" />
      </div>
      <div className="space-y-2">
        <h4 className="font-heading text-bb-black-bean font-semibold uppercase tracking-wide text-sm">
          {feature.title}
        </h4>
        <p className="font-serif text-bb-black-bean/70 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-bb-champagne" />;
  }

  return (
    <div className="min-h-screen bg-bb-champagne">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-bb-champagne via-bb-champagne-200 to-bb-champagne-300 border-b border-bb-champagne-400">
        <div className="absolute inset-0 bg-abstract-dots bg-dots opacity-20" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-bb-mahogany to-bb-citron rounded-xl animate-glow-pulse">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-bb-mahogany text-white font-heading uppercase tracking-wider px-4 py-1">
                Premium Member
              </Badge>
            </div>
            
            <h1 className="text-display-lg font-heading text-bb-black-bean uppercase tracking-wide mb-4 animate-fade-in-up">
              Your Wellness Journey
            </h1>
            
            <p className="text-lg font-serif text-bb-black-bean/80 leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Welcome back to your personalized wellness sanctuary. Today is another step toward your best self.
            </p>
            
            <div className="flex items-center gap-6 mt-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-bb-mahogany" />
                <span className="font-serif text-bb-black-bean/70 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-bb-mahogany" />
                <span className="font-serif text-bb-black-bean/70 text-sm">Day 127 of your journey</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Today's Wellness Metrics */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading text-bb-black-bean uppercase tracking-wide">
                Today's Wellness
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-bb-mahogany/20 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Mood"
                value={wellnessData.todayMetrics.mood}
                icon={Heart}
                color="bg-gradient-to-r from-pink-500 to-rose-500"
                description="Emotional well-being and positivity"
                trend="+0.3"
              />
              <MetricCard
                title="Energy"
                value={wellnessData.todayMetrics.energy}
                icon={Zap}
                color="bg-gradient-to-r from-bb-mahogany to-bb-citron"
                description="Physical vitality and alertness"
                trend="+0.5"
              />
              <MetricCard
                title="Sleep"
                value={wellnessData.todayMetrics.sleep}
                icon={Moon}
                color="bg-gradient-to-r from-blue-500 to-indigo-500"
                description="Rest quality and recovery"
                trend="+1.2"
              />
              <MetricCard
                title="Stress"
                value={wellnessData.todayMetrics.stress}
                icon={Brain}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                description="Mental calm and balance"
                trend="-0.8"
              />
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Weekly Progress & Goals */}
            <section className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-heading text-bb-black-bean uppercase tracking-wide">
                  Weekly Goals
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-bb-mahogany/20 to-transparent" />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {wellnessData.goals.map((goal) => (
                  <ProgressGoal key={goal.id} goal={goal} />
                ))}
              </div>
            </section>

            {/* AI Insights */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-heading text-bb-black-bean uppercase tracking-wide">
                  AI Insights
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-bb-mahogany/20 to-transparent" />
              </div>
              
              <div className="space-y-4">
                {wellnessData.insights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} index={index} />
                ))}
              </div>

              <Card className="border-0 bg-gradient-to-r from-bb-mahogany to-bb-citron text-white overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5" />
                      <span className="font-heading uppercase tracking-wide text-sm">AI Coach</span>
                    </div>
                    <p className="font-serif text-sm leading-relaxed mb-4">
                      "Based on your patterns, I recommend a 10-minute morning meditation to boost your energy levels."
                    </p>
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 border-white/30 text-white font-heading uppercase tracking-wide text-xs">
                      View Recommendation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Premium Features Showcase */}
          <section className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Crown className="h-6 w-6 text-bb-mahogany" />
                <h2 className="text-3xl font-heading text-bb-black-bean uppercase tracking-wide">
                  Premium Features
                </h2>
                <Crown className="h-6 w-6 text-bb-mahogany" />
              </div>
              <p className="font-serif text-bb-black-bean/70 max-w-2xl mx-auto leading-relaxed">
                Unlock the full potential of your wellness journey with our world-class premium features
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wellnessData.premiumFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <PremiumFeatureCard feature={feature} />
                </div>
              ))}
            </div>
          </section>

          {/* Journey Progress Visualization */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading text-bb-black-bean uppercase tracking-wide">
                Wellness Journey
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-bb-mahogany/20 to-transparent" />
            </div>
            
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-bb-champagne-50 to-white">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-bb-mahogany to-bb-citron rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Leaf className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-heading text-bb-black-bean uppercase tracking-wide text-sm mb-2">
                      Foundation Built
                    </h3>
                    <p className="font-serif text-bb-black-bean/70 text-sm leading-relaxed">
                      127 days of consistent wellness practices
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-bb-citron to-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-heading text-bb-black-bean uppercase tracking-wide text-sm mb-2">
                      Growth Phase
                    </h3>
                    <p className="font-serif text-bb-black-bean/70 text-sm leading-relaxed">
                      23% improvement in overall wellness metrics
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-heading text-bb-black-bean uppercase tracking-wide text-sm mb-2">
                      Peak Performance
                    </h3>
                    <p className="font-serif text-bb-black-bean/70 text-sm leading-relaxed">
                      On track to reach optimal wellness balance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Call to Action */}
          <section className="text-center py-12">
            <Card className="border-0 bg-gradient-to-r from-bb-mahogany via-bb-citron to-bb-mahogany overflow-hidden">
              <CardContent className="p-12 relative">
                <div className="absolute inset-0 bg-abstract-dots bg-dots opacity-10" />
                <div className="relative max-w-2xl mx-auto text-white">
                  <h2 className="text-display-md font-heading uppercase tracking-wide mb-4">
                    Continue Your Journey
                  </h2>
                  <p className="font-serif text-lg leading-relaxed mb-8 text-white/90">
                    Every moment is an opportunity to nurture your well-being. What will you focus on today?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-white text-bb-mahogany hover:bg-white/90 font-heading uppercase tracking-wide px-8"
                    >
                      Start Session
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/10 font-heading uppercase tracking-wide px-8"
                    >
                      View Progress
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
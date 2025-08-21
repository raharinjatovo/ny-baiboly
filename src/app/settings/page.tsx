/**
 * Settings page - User preferences and configuration
 */

'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Type, 
  Palette, 
  BookOpen, 
  Download, 
  Upload, 
  RotateCcw,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import {
  getUserPreferences,
  updatePreference,
  resetPreferences,
  exportPreferences,
  importPreferences,
  type UserPreferences,
} from '@/lib/preferences';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [importing, setImporting] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    setPreferences(getUserPreferences());
  }, []);

  const handlePreferenceChange = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    if (!preferences) return;
    
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    updatePreference(key, value);
  };

  const handleReset = () => {
    if (confirm('Miverina amin\'ny safidy tany am-boalohany ve ianao?')) {
      resetPreferences();
      setPreferences(getUserPreferences());
    }
  };

  const handleExport = () => {
    const data = exportPreferences();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ny-baiboly-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImporting(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string;
          if (importPreferences(jsonString)) {
            setPreferences(getUserPreferences());
            alert('Tafiditra soa aman-tsara ny safidy!');
          } else {
            alert('Nisy olana tamin\'ny fampidirana. Jereo ny rakitra.');
          }
        } catch {
          alert('Nisy olana tamin\'ny fampidirana ny safidy.');
        } finally {
          setImporting(false);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (!preferences) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Mamaky ny safidy...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Safidy
          </h1>
          <p className="text-lg text-muted-foreground">
            Amboary ny fomba fijerena sy famakiana
          </p>
        </div>

        {/* Reading Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Type className="mr-2 h-5 w-5" />
              Fomba famakiana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Font Size */}
            <div className="space-y-3">
              <h4 className="font-medium">Haben'ny soratra</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'small', label: 'Kely' },
                  { value: 'medium', label: 'Antonony' },
                  { value: 'large', label: 'Lehibe' },
                  { value: 'extra-large', label: 'Lehibe indrindra' },
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={preferences.fontSize === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePreferenceChange('fontSize', value as UserPreferences['fontSize'])}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-3">
              <h4 className="font-medium">Karazan-tsoratra</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'serif', label: 'Serif (tsara ho an\'ny famakiana)' },
                  { value: 'sans-serif', label: 'Sans-serif (maoderina)' },
                  { value: 'monospace', label: 'Monospace (mitovy elanelana)' },
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={preferences.fontFamily === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePreferenceChange('fontFamily', value as UserPreferences['fontFamily'])}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Line Height */}
            <div className="space-y-3">
              <h4 className="font-medium">Elanelana eo amin\'ny andalana</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'compact', label: 'Mifofotra' },
                  { value: 'normal', label: 'Antonony' },
                  { value: 'relaxed', label: 'Malalaka' },
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={preferences.lineHeight === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePreferenceChange('lineHeight', value as UserPreferences['lineHeight'])}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Fomba fisehoana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="space-y-3">
              <h4 className="font-medium">Loko</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'light', label: 'Mazava', icon: Sun },
                  { value: 'dark', label: 'Maizina', icon: Moon },
                  { value: 'system', label: 'Manaraka ny rafitra', icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={preferences.theme === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePreferenceChange('theme', value as UserPreferences['theme'])}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Other display options */}
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.reducedMotion}
                  onChange={(e) => handlePreferenceChange('reducedMotion', e.target.checked)}
                  className="rounded border-input"
                />
                <span>Ahena ny fanetsehana (ho an\'ny olona mora havesatra)</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Reading Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Fitondran-tena amin\'ny famakiana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences.showVerseNumbers}
                onChange={(e) => handlePreferenceChange('showVerseNumbers', e.target.checked)}
                className="rounded border-input"
              />
              <span>Asehoy ny isa andinin-tsoratra</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences.highlightVerses}
                onChange={(e) => handlePreferenceChange('highlightVerses', e.target.checked)}
                className="rounded border-input"
              />
              <span>Asongadino ny andinin-tsoratra rehefa tsindrina</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences.rememberLastPosition}
                onChange={(e) => handlePreferenceChange('rememberLastPosition', e.target.checked)}
                className="rounded border-input"
              />
              <span>Tadidio ny toerana farany novakiana</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences.showReadingProgress}
                onChange={(e) => handlePreferenceChange('showReadingProgress', e.target.checked)}
                className="rounded border-input"
              />
              <span>Asehoy ny fivoaran\'ny famakiana</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences.autoScroll}
                onChange={(e) => handlePreferenceChange('autoScroll', e.target.checked)}
                className="rounded border-input"
              />
              <span>Mihetsika ho azy rehefa mivaky toerana vaovao</span>
            </label>
          </CardContent>
        </Card>

        {/* Import/Export Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Fikarakarana safidy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Halaina ny safidy
              </Button>
              
              <Button variant="outline" onClick={handleImport} disabled={importing}>
                <Upload className="mr-2 h-4 w-4" />
                {importing ? 'Miditra...' : 'Hampiditra safidy'}
              </Button>
              
              <Button variant="outline" onClick={handleReset} className="text-destructive hover:text-destructive">
                <RotateCcw className="mr-2 h-4 w-4" />
                Averina amin\'ny voalohany
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Tseho manoloana</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-4 border border-border rounded-md bg-background"
              style={{
                fontSize: `var(--reading-font-size, 16px)`,
                fontFamily: `var(--reading-font-family, serif)`,
                lineHeight: `var(--reading-line-height, 1.6)`,
              }}
            >
              <p className="mb-4">
                <span className={`text-muted-foreground mr-2 ${preferences.showVerseNumbers ? 'inline' : 'hidden'}`}>
                  1
                </span>
                Tany am-boalohany Andriamanitra dia nahary ny lanitra sy ny tany.
              </p>
              <p>
                <span className={`text-muted-foreground mr-2 ${preferences.showVerseNumbers ? 'inline' : 'hidden'}`}>
                  2
                </span>
                Ary ny tany dia tsy nisy endrika sady foana; ary aizina no tambonin'ny lalina. Ary ny Fanahin'Andriamanitra dia nanidina tambonin'ny rano.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

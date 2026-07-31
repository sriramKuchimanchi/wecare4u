/**
 * Centralized icon mapping.
 * Import icons from here so they can be swapped/aliased in one place.
 */
import {
  Home, Users, User, Heart, Calendar, Phone, Mail, Bell, Settings, LogOut,
  Menu, X, Search, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Minus, Check, CheckCircle, AlertCircle, AlertTriangle, Info,
  Clock, MapPin, MessageSquare, Shield, Activity, Pill, Stethoscope,
  Ambulance, FlaskConical, Car, FileText, Download, Upload, Edit, Trash2,
  Eye, EyeOff, Lock, Unlock, UserPlus, UserCheck, PhoneCall, Video,
  Send, MoreHorizontal, MoreVertical, Filter, ArrowRight, ArrowLeft,
  ArrowUp, ArrowDown, Star, Award, BadgeCheck, CircleDot, Dot,
  LayoutDashboard, CalendarDays, ClipboardList, LifeBuoy, Siren,
  Microscope, Building2, Briefcase, RefreshCw, Loader2,
  ChevronFirst, ChevronLast, ExternalLink, Copy, Save, Printer,
  Share2, Bookmark, Flag, HelpCircle, Sparkles, Brain, Zap,
  Smartphone, Globe, History, ListChecks, ListOrdered, ListTree,
  Table, Table2, Hash, AtSign, Link, Link2, Tags, Tag, BellRing,
  Play, Pause, Mic, Camera, ScanLine, ScanFace, QrCode,
  Fingerprint, BadgeDollarSign, DollarSign, CreditCard, Wallet,
  Receipt, Banknote, Coins, Store, ShoppingBag, ShoppingCart, Package,
  Gift, Trophy, Medal, Crown, StarHalf, ThumbsUp, ThumbsDown,
  HeartHandshake, Handshake, Hand, HandHeart, Smile, Frown, Meh,
  Laugh, Angry, Glasses, Focus,
  Maximize, Minimize, ZoomIn, ZoomOut, Expand, Shrink, Compass,
  Navigation, MapPinned, Map, Globe2, Plane, Rocket, Ship, Train,
  Bus, CarFront, Bike, Footprints, Accessibility,
  Construction, SkipForward,
  type LucideIcon,
} from 'lucide-react';

export const icons = {
  Home, Users, User, Heart, Calendar, Phone, Mail, Bell, Settings, LogOut,
  Menu, X, Search, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Minus, Check, CheckCircle, AlertCircle, AlertTriangle, Info,
  Clock, MapPin, MessageSquare, Shield, Activity, Pill, Stethoscope,
  Ambulance, FlaskConical, Car, FileText, Download, Upload, Edit, Trash2,
  Eye, EyeOff, Lock, Unlock, UserPlus, UserCheck, PhoneCall, Video,
  Send, MoreHorizontal, MoreVertical, Filter, ArrowRight, ArrowLeft,
  ArrowUp, ArrowDown, Star, Award, BadgeCheck, CircleDot, Dot,
  LayoutDashboard, CalendarDays, ClipboardList, LifeBuoy, Siren,
  Microscope, Building2, Briefcase, RefreshCw, Loader2,
  ChevronFirst, ChevronLast, ExternalLink, Copy, Save, Printer,
  Share2, Bookmark, Flag, HelpCircle, Sparkles, Brain, Zap,
  Smartphone, Globe, History, ListChecks, ListOrdered, ListTree,
  Table, Table2, Hash, AtSign, Link, Link2, Tags, Tag, BellRing,
  Play, Pause, Mic, Camera, ScanLine, ScanFace, QrCode,
  Fingerprint, BadgeDollarSign, DollarSign, CreditCard, Wallet,
  Receipt, Banknote, Coins, Store, ShoppingBag, ShoppingCart, Package,
  Gift, Trophy, Medal, Crown, StarHalf, ThumbsUp, ThumbsDown,
  HeartHandshake, Handshake, Hand, HandHeart, Smile, Frown, Meh,
  Laugh, Angry, Glasses, Focus,
  Maximize, Minimize, ZoomIn, ZoomOut, Expand, Shrink, Compass,
  Navigation, MapPinned, Map, Globe2, Plane, Rocket, Ship, Train,
  Bus, CarFront, Bike, Footprints, Accessibility,
  Construction, SkipForward,
} as const;

// Re-export individual icons for direct named imports
export {
  Home, Users, User, Heart, Calendar, Phone, Mail, Bell, Settings, LogOut,
  Menu, X, Search, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Minus, Check, CheckCircle, AlertCircle, AlertTriangle, Info,
  Clock, MapPin, MessageSquare, Shield, Activity, Pill, Stethoscope,
  Ambulance, FlaskConical, Car, FileText, Download, Upload, Edit, Trash2,
  Eye, EyeOff, Lock, Unlock, UserPlus, UserCheck, PhoneCall, Video,
  Send, MoreHorizontal, MoreVertical, Filter, ArrowRight, ArrowLeft,
  ArrowUp, ArrowDown, Star, Award, BadgeCheck, CircleDot, Dot,
  LayoutDashboard, CalendarDays, ClipboardList, LifeBuoy, Siren,
  Microscope, Building2, Briefcase, RefreshCw, Loader2,
  ChevronFirst, ChevronLast, ExternalLink, Copy, Save, Printer,
  Share2, Bookmark, Flag, HelpCircle, Sparkles, Brain, Zap,
  Smartphone, Globe, History, ListChecks, ListOrdered, ListTree,
  Table, Table2, Hash, AtSign, Link, Link2, Tags, Tag, BellRing,
  Play, Pause, Mic, Camera, ScanLine, ScanFace, QrCode,
  Fingerprint, BadgeDollarSign, DollarSign, CreditCard, Wallet,
  Receipt, Banknote, Coins, Store, ShoppingBag, ShoppingCart, Package,
  Gift, Trophy, Medal, Crown, StarHalf, ThumbsUp, ThumbsDown,
  HeartHandshake, Handshake, Hand, HandHeart, Smile, Frown, Meh,
  Laugh, Angry, Glasses, Focus,
  Maximize, Minimize, ZoomIn, ZoomOut, Expand, Shrink, Compass,
  Navigation, MapPinned, Map, Globe2, Plane, Rocket, Ship, Train,
  Bus, CarFront, Bike, Footprints, Accessibility,
  Construction, SkipForward,
};

export type IconName = keyof typeof icons;

export type { LucideIcon };

export default icons;

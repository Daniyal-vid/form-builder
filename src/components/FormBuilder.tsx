// 'use client'

// import { useState } from 'react'
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Trash2, GripVertical, Settings, Plus } from 'lucide-react'
// import { Field, FormData, fieldTypes } from '@/lib/validations/forms'
// import { FieldEditor } from './FieldEditor'
// import { FormSettings } from './FormSettings'

// interface FormBuilderProps {
//   initialData?: FormData
//   onSave: (formData: FormData) => Promise<void>
//   isLoading?: boolean
// }

// export function FormBuilder({ initialData, onSave, isLoading }: FormBuilderProps) {
//   const [formData, setFormData] = useState<FormData>(
//     initialData || {
//       title: '',
//       description: '',
//       fields: [],
//       settings: {
//         thankYouMessage: 'Thank you for your submission!',
//         allowMultipleSubmissions: false,
//       }
//     }
//   )
  
//   const [editingField, setEditingField] = useState<Field | null>(null)
//   const [showSettings, setShowSettings] = useState(false)

//   const addField = (type: typeof fieldTypes[number]) => {
//     const newField: Field = {
//       id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       type,
//       label: `New ${type} field`,
//       placeholder: '',
//       helpText: '',
//       required: false,
//       options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined,
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       fields: [...prev.fields, newField]
//     }))
//   }

//   const updateField = (fieldId: string, updates: Partial<Field>) => {
//     setFormData(prev => ({
//       ...prev,
//       fields: prev.fields.map(field => 
//         field.id === fieldId ? { ...field, ...updates } : field
//       )
//     }))
//   }

//   const removeField = (fieldId: string) => {
//     setFormData(prev => ({
//       ...prev,
//       fields: prev.fields.filter(field => field.id !== fieldId)
//     }))
//   }

//   const handleDragEnd = (result: any) => {
//     if (!result.destination) return

//     const items = Array.from(formData.fields)
//     const [reorderedItem] = items.splice(result.source.index, 1)
//     items.splice(result.destination.index, 0, reorderedItem)

//     setFormData(prev => ({
//       ...prev,
//       fields: items
//     }))
//   }

//   const handleSave = async () => {
//     if (!formData.title.trim()) {
//       alert('Please enter a form title')
//       return
//     }
    
//     if (formData.fields.length === 0) {
//       alert('Please add at least one field')
//       return
//     }

//     await onSave(formData)
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Panel - Form Builder */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Form Header */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Form Details</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="title">Form Title *</Label>
//                 <Input
//                   id="title"
//                   value={formData.title}
//                   onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                   placeholder="Enter form title"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description || ''}
//                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter form description (optional)"
//                   rows={3}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Form Fields */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Form Fields</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <DragDropContext onDragEnd={handleDragEnd}>
//                 <Droppable droppableId="fields">
//                   {(provided) => (
//                     <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
//                       {formData.fields.map((field, index) => (
//                         <Draggable key={field.id} draggableId={field.id} index={index}>
//                           {(provided, snapshot) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               className={`p-4 border rounded-lg bg-white ${
//                                 snapshot.isDragging ? 'shadow-lg' : ''
//                               }`}
//                             >
//                               <div className="flex items-center justify-between mb-2">
//                                 <div className="flex items-center gap-2">
//                                   <div {...provided.dragHandleProps}>
//                                     <GripVertical className="w-4 h-4 text-gray-400" />
//                                   </div>
//                                   <span className="font-medium">{field.label}</span>
//                                   <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                                     {field.type}
//                                   </span>
//                                 </div>
//                                 <div className="flex gap-2">
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => setEditingField(field)}
//                                   >
//                                     <Settings className="w-4 h-4" />
//                                   </Button>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => removeField(field.id)}
//                                   >
//                                     <Trash2 className="w-4 h-4" />
//                                   </Button>
//                                 </div>
//                               </div>
//                               <FieldPreview field={field} />
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </div>
//                   )}
//                 </Droppable>
//               </DragDropContext>
              
//               {formData.fields.length === 0 && (
//                 <div className="text-center py-8 text-gray-500">
//                   No fields added yet. Choose a field type from the right panel to get started.
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Actions */}
//           <div className="flex gap-4">
//             <Button onClick={handleSave} disabled={isLoading}>
//               {isLoading ? 'Saving...' : 'Save Form'}
//             </Button>
//             <Button variant="outline" onClick={() => setShowSettings(true)}>
//               Form Settings
//             </Button>
//           </div>
//         </div>

//         {/* Right Panel - Field Types */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Add Field</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 gap-2">
//                 {fieldTypes.map((type) => (
//                   <Button
//                     key={type}
//                     variant="outline"
//                     onClick={() => addField(type)}
//                     className="justify-start"
//                   >
//                     <Plus className="w-4 h-4 mr-2" />
//                     {type.charAt(0).toUpperCase() + type.slice(1)}
//                   </Button>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Field Editor Modal */}
//       {editingField && (
//         <FieldEditor
//           field={editingField}
//           onSave={(updatedField) => {
//             updateField(editingField.id, updatedField)
//             setEditingField(null)
//           }}
//           onClose={() => setEditingField(null)}
//         />
//       )}

//       {/* Form Settings Modal */}
//       {showSettings && (
//         <FormSettings
//           settings={formData.settings}
//           onSave={(settings) => {
//             setFormData(prev => ({ ...prev, settings }))
//             setShowSettings(false)
//           }}
//           onClose={() => setShowSettings(false)}
//         />
//       )}
//     </div>
//   )
// }

// // Field Preview Component
// function FieldPreview({ field }: { field: Field }) {
//   switch (field.type) {
//     case 'text':
//     case 'email':
//       return (
//         <Input
//           placeholder={field.placeholder}
//           disabled
//           className="bg-gray-50"
//         />
//       )
//     case 'number':
//       return (
//         <Input
//           type="number"
//           placeholder={field.placeholder}
//           disabled
//           className="bg-gray-50"
//         />
//       )
//     case 'textarea':
//       return (
//         <Textarea
//           placeholder={field.placeholder}
//           disabled
//           className="bg-gray-50"
//           rows={3}
//         />
//       )
//     case 'select':
//       return (
//         <Select disabled>
//           <SelectTrigger className="bg-gray-50">
//             <SelectValue placeholder={field.placeholder || 'Select an option'} />
//           </SelectTrigger>
//         </Select>
//       )
//     case 'radio':
//       return (
//         <div className="space-y-2">
//           {field.options?.map((option, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <input type="radio" disabled className="text-gray-400" />
//               <span className="text-gray-600">{option}</span>
//             </div>
//           ))}
//         </div>
//       )
//     case 'checkbox':
//       return (
//         <div className="space-y-2">
//           {field.options?.map((option, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <Checkbox disabled />
//               <span className="text-gray-600">{option}</span>
//             </div>
//           ))}
//         </div>
//       )
//     case 'date':
//       return (
//         <Input
//           type="date"
//           disabled
//           className="bg-gray-50"
//         />
//       )
//     case 'file':
//       return (
//         <Input
//           type="file"
//           disabled
//           className="bg-gray-50"
//         />
//       )
//     default:
//       return null
//   }
// }
"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"
import {
  ArrowLeft,
  Settings,
  Eye,
  MoreHorizontal,
  Plus,
  GripVertical,
  Trash2,
  Type,
  Mail,
  AlignLeft,
  Hash,
  ChevronDown,
  CheckSquare,
  Calendar,
  Upload,
  Phone,
  Linkedin,
  Link,
  Video,
  X,
} from "lucide-react"
import { FormData, Field } from "@/lib/validations/forms"

const fieldTypeOptions = [
  { type: "text", label: "Short answer", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "textarea", label: "Long answer", icon: AlignLeft },
  { type: "number", label: "Number", icon: Hash },
  { type: "select", label: "Dropdown", icon: ChevronDown },
  { type: "radio", label: "Multiple choice", icon: CheckSquare },
  { type: "checkbox", label: "Checkboxes", icon: CheckSquare },
  { type: "date", label: "Date", icon: Calendar },
  { type: "file", label: "File upload", icon: Upload },
]

interface FormBuilderProps {
  initialData?: FormData
  onSave: (formData: FormData) => Promise<void>
  isLoading?: boolean
}

export default function FormBuilder({ initialData, onSave, isLoading }: FormBuilderProps) {
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      title: "Untitled Form",
      description: "",
      fields: [],
      settings: {
        thankYouMessage: "Thank you for your submission!",
        allowMultipleSubmissions: false,
      }
    }
  )

  const [isAddingField, setIsAddingField] = useState(false)
  const [editingField, setEditingField] = useState<Field | null>(null)

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a form title')
      return
    }
    
    if (formData.fields.length === 0) {
      alert('Please add at least one field')
      return
    }

    await onSave(formData)
  }

  const addField = (type: string, label: string) => {
    const newField: Field = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      label: label,
      placeholder: "",
      required: false,
      options: ["select", "radio", "checkbox"].includes(type) ? ["Option 1", "Option 2"] : undefined,
      validation: {},
    }

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }))
    setIsAddingField(false)
  }

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
    }))
    
    if (editingField && editingField.id === fieldId) {
      setEditingField({ ...editingField, ...updates })
    }
  }

  const removeField = (fieldId: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(formData.fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFormData((prev) => ({
      ...prev,
      fields: items,
    }))
  }

  const toggleRequired = (fieldId: string) => {
    updateField(fieldId, { required: !formData.fields.find(f => f.id === fieldId)?.required })
  }

  const addOption = (fieldId: string) => {
    const field = formData.fields.find(f => f.id === fieldId)
    if (field && field.options) {
      const newOptions = [...field.options, `Option ${field.options.length + 1}`]
      updateField(fieldId, { options: newOptions })
    }
  }

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = formData.fields.find(f => f.id === fieldId)
    if (field && field.options) {
      const newOptions = field.options.map((opt, idx) => idx === optionIndex ? value : opt)
      updateField(fieldId, { options: newOptions })
    }
  }

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = formData.fields.find(f => f.id === fieldId)
    if (field && field.options && field.options.length > 1) {
      const newOptions = field.options.filter((_, idx) => idx !== optionIndex)
      updateField(fieldId, { options: newOptions })
    }
  }

  const renderField = (field: Field, index: number) => {
    return (
      <Draggable key={field.id} draggableId={field.id} index={index}>
        {(provided, snapshot) => (
          <Card 
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group p-6 mb-4 transition-all duration-200 ${
              snapshot.isDragging ? "shadow-lg scale-105" : "hover:shadow-md"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    {...provided.dragHandleProps}
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                  >
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    className="text-lg font-medium border-none p-0 focus-visible:ring-0"
                    placeholder="Question"
                  />
                  {field.required && <span className="text-red-500">*</span>}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingField(field)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Field Settings</DialogTitle>
                      </DialogHeader>
                      {editingField && (
                        <FieldSettingsPanel
                          field={editingField}
                          onUpdate={(updates) => updateField(editingField.id, updates)}
                          onClose={() => setEditingField(null)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeField(field.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Input
                value={field.placeholder || ""}
                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                className="text-sm text-gray-500 border-none p-0 focus-visible:ring-0"
                placeholder="Add placeholder text"
              />

              {field.helpText && (
                <p className="text-sm text-gray-600">{field.helpText}</p>
              )}

              <FieldPreview 
                field={field}
                onAddOption={() => addOption(field.id)}
                onUpdateOption={(idx, value) => updateOption(field.id, idx, value)}
                onRemoveOption={(idx) => removeOption(field.id, idx)}
              />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.required}
                      onCheckedChange={() => toggleRequired(field.id)}
                    />
                    <span>Required</span>
                  </div>
                  {field.validation && Object.keys(field.validation).length > 0 && (
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      Validation rules applied
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </Draggable>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Effect */}
    

      <div className="relative z-10 min-h-screen bg-gray-50/80 backdrop-blur-sm">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button 
                className="bg-black text-white hover:bg-gray-800" 
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Form"}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content - Centered */}
        <main className="flex justify-center py-8 px-6">
          <div className="w-full max-w-2xl">
            {/* Form Header */}
            <Card className="p-8 mb-6 bg-white/90 backdrop-blur-sm">
              <div className="space-y-4">
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="text-3xl font-bold border-none p-0 focus-visible:ring-0"
                  placeholder="Untitled Form"
                />
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Add a form description"
                  className="border-none p-0 focus-visible:ring-0 resize-none"
                  rows={2}
                />
              </div>
            </Card>

            {/* Form Fields with Drag & Drop */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fields">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {formData.fields.map((field, index) => renderField(field, index))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Add New Question Button */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <Popover open={isAddingField} onOpenChange={setIsAddingField}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                    onClick={() => setIsAddingField(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add new question
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <div className="p-2">
                    <div className="grid gap-1">
                      {fieldTypeOptions.map((fieldType) => {
                        const Icon = fieldType.icon
                        return (
                          <Button
                            key={fieldType.type}
                            variant="ghost"
                            className="w-full justify-start h-auto p-3"
                            onClick={() => addField(fieldType.type, fieldType.label)}
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            <span>{fieldType.label}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

// Field Settings Panel Component
interface FieldSettingsPanelProps {
  field: Field
  onUpdate: (updates: Partial<Field>) => void
  onClose: () => void
}

function FieldSettingsPanel({ field, onUpdate, onClose }: FieldSettingsPanelProps) {
  const [editedField, setEditedField] = useState<Field>(field)

  const handleSave = () => {
    onUpdate(editedField)
    onClose()
  }

  const addOption = () => {
    setEditedField(prev => ({
      ...prev,
      options: [...(prev.options || []), '']
    }))
  }

  const updateOption = (index: number, value: string) => {
    setEditedField(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt)
    }))
  }

  const removeOption = (index: number) => {
    setEditedField(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    }))
  }

  const needsOptions = ['select', 'radio', 'checkbox'].includes(editedField.type)

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="type">Field Type</Label>
            <Select
              value={editedField.type}
              onValueChange={(value: any) =>
                setEditedField(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypeOptions.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="label">Label *</Label>
            <Input
              id="label"
              value={editedField.label}
              onChange={(e) => setEditedField(prev => ({ ...prev, label: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={editedField.placeholder || ''}
              onChange={(e) => setEditedField(prev => ({ ...prev, placeholder: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="helpText">Help Text</Label>
            <Textarea
              id="helpText"
              value={editedField.helpText || ''}
              onChange={(e) => setEditedField(prev => ({ ...prev, helpText: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={editedField.required}
              onCheckedChange={(checked) =>
                setEditedField(prev => ({ ...prev, required: checked as boolean }))
              }
            />
            <Label htmlFor="required">Required field</Label>
          </div>
        </CardContent>
      </Card>

      {/* Options for select, radio, checkbox */}
      {needsOptions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {editedField.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(editedField.type === 'text' || editedField.type === 'textarea') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={editedField.validation?.minLength || ''}
                    onChange={(e) =>
                      setEditedField(prev => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          minLength: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxLength">Maximum Length</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    value={editedField.validation?.maxLength || ''}
                    onChange={(e) =>
                      setEditedField(prev => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          maxLength: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}

          {editedField.type === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min">Minimum Value</Label>
                <Input
                  id="min"
                  type="number"
                  value={editedField.validation?.min || ''}
                  onChange={(e) =>
                    setEditedField(prev => ({
                      ...prev,
                      validation: {
                        ...prev.validation,
                        min: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="max">Maximum Value</Label>
                <Input
                  id="max"
                  type="number"
                  value={editedField.validation?.max || ''}
                  onChange={(e) =>
                    setEditedField(prev => ({
                      ...prev,
                      validation: {
                        ...prev.validation,
                        max: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="pattern">Custom Pattern (RegEx)</Label>
            <Input
              id="pattern"
              value={editedField.validation?.pattern || ''}
              onChange={(e) =>
                setEditedField(prev => ({
                  ...prev,
                  validation: {
                    ...prev.validation,
                    pattern: e.target.value || undefined
                  }
                }))
              }
              placeholder="e.g., ^[A-Za-z]+$"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}

// Field Preview Component
interface FieldPreviewProps {
  field: Field
  onAddOption?: () => void
  onUpdateOption?: (index: number, value: string) => void
  onRemoveOption?: (index: number) => void
}

function FieldPreview({ field, onAddOption, onUpdateOption, onRemoveOption }: FieldPreviewProps) {
  switch (field.type) {
    case "text":
      return <Input placeholder={field.placeholder || "Short answer text"} disabled />
    case "email":
      return <Input type="email" placeholder={field.placeholder || "Email address"} disabled />
    case "textarea":
      return <Textarea placeholder={field.placeholder || "Long answer text"} disabled rows={3} />
    case "number":
      return <Input type="number" placeholder={field.placeholder || "Number"} disabled />
    case "select":
      return (
        <div>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
          </Select>
          <div className="mt-2 space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => onUpdateOption?.(index, e.target.value)}
                  className="text-sm"
                />
                {field.options && field.options.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveOption?.(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddOption}
              className="text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add option
            </Button>
          </div>
        </div>
      )
    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input type="radio" disabled className="text-gray-400" />
              <Input
                value={option}
                onChange={(e) => onUpdateOption?.(index, e.target.value)}
                className="text-sm flex-1"
              />
              {field.options && field.options.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveOption?.(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddOption}
            className="text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add option
          </Button>
        </div>
      )
    case "checkbox":
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox disabled />
              <Input
                value={option}
                onChange={(e) => onUpdateOption?.(index, e.target.value)}
                className="text-sm flex-1"
              />
              {field.options && field.options.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveOption?.(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddOption}
            className="text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add option
          </Button>
        </div>
      )
    case "date":
      return <Input type="date" disabled />
    case "file":
      return (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
        </div>
      )
    default:
      return <Input placeholder="Your answer" disabled />
  }
}
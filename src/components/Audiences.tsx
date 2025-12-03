import { useEffect, useState } from 'react';
import { Plus, Users, Edit, Trash2, Tag } from 'lucide-react';
import { supabase, Audience } from '../lib/supabase';
import BuddyMascot from './BuddyMascot';

export default function Audiences() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAudience, setEditingAudience] = useState<Audience | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: {} as Record<string, any>,
    subscriber_count: 0,
  });

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('audiences')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudiences(data || []);
    } catch (error) {
      console.error('Error loading audiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingAudience) {
        const { error } = await supabase
          .from('audiences')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAudience.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('audiences')
          .insert({
            ...formData,
            user_id: user.id,
          });

        if (error) throw error;
      }

      setShowForm(false);
      setEditingAudience(null);
      setFormData({ name: '', description: '', criteria: {}, subscriber_count: 0 });
      await loadAudiences();
    } catch (error) {
      console.error('Error saving audience:', error);
    }
  };

  const handleEdit = (audience: Audience) => {
    setEditingAudience(audience);
    setFormData({
      name: audience.name,
      description: audience.description,
      criteria: audience.criteria,
      subscriber_count: audience.subscriber_count,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this audience?')) return;

    try {
      const { error } = await supabase
        .from('audiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadAudiences();
    } catch (error) {
      console.error('Error deleting audience:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAudience(null);
    setFormData({ name: '', description: '', criteria: {}, subscriber_count: 0 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BuddyMascot mood="thinking" message="Loading your audiences..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Audiences</h2>
          <p className="text-gray-600 mt-1">Segment your subscribers for targeted campaigns</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Audience</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingAudience ? 'Edit Audience' : 'Create New Audience'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audience Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., VIP Customers, Newsletter Subscribers"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this audience segment"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Subscriber Count
              </label>
              <input
                type="number"
                value={formData.subscriber_count}
                onChange={(e) => setFormData({ ...formData, subscriber_count: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 1000"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {editingAudience ? 'Update Audience' : 'Create Audience'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {audiences.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BuddyMascot mood="happy" message="Let's create your first audience segment!" />
          <h3 className="text-xl font-semibold text-gray-800 mt-6">No audiences yet</h3>
          <p className="text-gray-600 mt-2">Start by creating your first audience segment</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Create Audience
          </button>
        </div>
      ) : !showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((audience) => (
            <div key={audience.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{audience.name}</h3>
                      <p className="text-sm text-gray-600">{audience.subscriber_count} subscribers</p>
                    </div>
                  </div>
                </div>

                {audience.description && (
                  <p className="text-sm text-gray-600 mb-4">{audience.description}</p>
                )}

                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Tag className="w-3 h-3" />
                  <span>Created {new Date(audience.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleEdit(audience)}
                  className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(audience.id)}
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

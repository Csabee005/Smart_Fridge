import tensorflow as tf
import keras as k
import theano

print(k.__version__)

from tensorflow.python.client import device_lib
print(device_lib.list_local_devices())



sess = tf.Session(config=tf.compat.v1.ConfigProto(log_device_placement=True))

print(tf.__version__)

mnist = tf.keras.datasets.mnist # 28x28 images of hand-written digits 0-9

(x_train, y_train), (x_test, y_test) = mnist.load_data()

x_train = tf.keras.utils.normalize(x_train, axis = 1)
x_test = tf.keras.utils.normalize(x_test, axis = 1)

model = tf.keras.models.Sequential()
model.add(tf.keras.layers.Flatten())
model.add(tf.keras.layers.Dense(128, activation=tf.nn.relu))
model.add(tf.keras.layers.Dense(128, activation=tf.nn.relu))
model.add(tf.keras.layers.Dense(10, activation=tf.nn.softmax))

model.compile(optimizer='adam' ,
            loss='sparse_categorical_crossentropy' ,
            metrics=['accuracy'])

model.fit(x_train, y_train, epochs=5)

val_loss, val_acc = model.evaluate(x_test, y_test)
print(val_loss, val_acc)

model.save('epic_num_reader.model')

predictions = model.predict([x_test])

print(predictions)

import numpy as np

print(np.argmax(predictions[0]))

import matplotlib.pyplot as plt

plt.imshow(x_test[0])
plt.show()
